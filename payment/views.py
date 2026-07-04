import razorpay
import uuid
import os
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .forms import ShippingAddressForm
from .models import Order, ShippingAddress, OrderItems
from cart.cart import Cart


# ─────────────────────────────────────────────
# Checkout — Shipping Address
# ─────────────────────────────────────────────
@login_required
def checkout(request):
    """Step 1: Collect shipping address."""
    cart = Cart(request)

    if not cart.products():
        return redirect("cart_summary")

    if request.method == "POST":
        form = ShippingAddressForm(request.POST)
        if form.is_valid():
            address = form.save()
            order   = Order.objects.create(user=request.user, address=address)
            return redirect("billing_info", pk=order.pk)
    else:
        form = ShippingAddressForm()

    context = {
        "form":     form,
        "products": cart.products(),
        "total":    cart.total(),
    }
    return render(request, "checkout.html", context)


# ─────────────────────────────────────────────
# Billing Info — Review before payment
# ─────────────────────────────────────────────
def billing_info(request, pk):
    """Step 2: Show billing summary and Razorpay Pay button."""
    cart  = Cart(request)
    order = get_object_or_404(Order, pk=pk)

    context = {
        "products": cart.products(),
        "total":    cart.total(),
        "order":    order,
        "delivery": 100,  # flat delivery charge ₹100
    }
    return render(request, "billing_info.html", context)


# ─────────────────────────────────────────────
# Process Order — Create Razorpay order
# ─────────────────────────────────────────────
@login_required
def proccess_order(request, pk):
    """Create Razorpay order and save order items; return JSON for frontend."""
    cart      = Cart(request)
    products  = cart.products()
    delivery  = 100  # flat ₹100 delivery
    total_amount = cart.total() + delivery

    client = razorpay.Client(auth=(settings.RAZOR_PAY_KEY_ID, settings.RAZOR_PAY_SECRET_KEY))
    razorpay_order = client.order.create({
        "amount":          int(total_amount) * 100,  # paise
        "currency":        "INR",
        "payment_capture": "1"
    })

    # Save Razorpay order ID and amount
    order = get_object_or_404(Order, pk=pk)
    order.order_id    = razorpay_order["id"]
    order.amount_paid = total_amount
    order.save()

    # Create line items & reduce stock
    for product, qty in products.items():
        price = product.discount_price if product.is_discount else product.price
        OrderItems.objects.create(
            order            = order,
            product          = product,
            product_name     = product.name,
            product_price    = price,
            product_qty      = qty,
            product_category = product.category,
        )
        # Decrease stock
        product.stock = max(0, product.stock - int(qty))
        product.save()

    # Build callback URL (HTTPS in production)
    callback_url = request.build_absolute_uri(reverse(settings.RAZOR_PAY_CALLBACK_URL))
    if os.environ.get("ENVIRONMENT") == "production":
        callback_url = callback_url.replace("http://", "https://")

    return JsonResponse({
        "order_id":      razorpay_order["id"],
        "razorpay_key_id": settings.RAZOR_PAY_KEY_ID,
        "product_name":  request.user.username,
        "amount":        razorpay_order["amount"],
        "callback_url":  callback_url,
    })


# ─────────────────────────────────────────────
# Payment Verify — Razorpay Webhook
# ─────────────────────────────────────────────
@csrf_exempt
def payment_verify(request):
    """Verify Razorpay signature; mark order as paid on success."""
    if "razorpay_signature" in request.POST:
        client = razorpay.Client(auth=(settings.RAZOR_PAY_KEY_ID, settings.RAZOR_PAY_SECRET_KEY))

        order_id            = request.POST.get("razorpay_order_id")
        razorpay_payment_id = request.POST.get("razorpay_payment_id")
        razorpay_signature  = request.POST.get("razorpay_signature")

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id":   order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature":  razorpay_signature,
            })

            # Mark order as paid
            order            = Order.objects.get(order_id=order_id)
            order.is_paid    = True
            order.payment_id = razorpay_payment_id
            order.signature  = razorpay_signature
            order.status     = "processing"
            order.save()

            # Update sales counter
            for item in order.items.all():
                if item.product:
                    item.product.no_of_sales += item.product_qty
                    item.product.save()

            # Clear cart
            if "session_key" in request.session:
                del request.session["session_key"]

            return render(request, "payment_verify.html", {
                "status":   "success",
                "order":    order,
            })

        except razorpay.errors.SignatureVerificationError:
            return render(request, "payment_verify.html", {"status": "failed"})

    return render(request, "payment_verify.html", {"status": "invalid"})


# ─────────────────────────────────────────────
# Update Shipping Address
# ─────────────────────────────────────────────
def update_address(request, order_pk, pk):
    address = get_object_or_404(ShippingAddress, pk=pk)
    form    = ShippingAddressForm(instance=address)

    if request.method == "POST":
        form = ShippingAddressForm(request.POST, instance=address)
        if form.is_valid():
            form.save()
            return redirect("billing_info", pk=order_pk)

    return render(request, "checkout.html", {"form": form})


# ─────────────────────────────────────────────
# Mock Payment Gateway
# ─────────────────────────────────────────────
@login_required
def mock_pay(request, pk):
    """Simulate a successful payment for testing without Razorpay."""
    order = get_object_or_404(Order, pk=pk)
    
    # Simulate payment success
    order.is_paid = True
    order.payment_id = f"pay_mock_{uuid.uuid4().hex[:12]}"
    order.status = "processing"
    order.save()
    
    # Update sales counter and reduce stock
    for item in order.items.all():
        if item.product:
            item.product.no_of_sales += item.product_qty
            item.product.stock = max(0, item.product.stock - int(item.product_qty))
            item.product.save()
            
    # Clear cart session
    if "session_key" in request.session:
        del request.session["session_key"]
        request.session.modified = True
        
    return redirect("payment_success", pk=order.pk)


@login_required
def payment_success(request, pk):
    """Display success receipt after mock payment."""
    order = get_object_or_404(Order, pk=pk)
    return render(request, "payment_verify.html", {
        "status": "success",
        "order": order,
    })


@login_required
def api_my_orders(request):
    """Return JSON of user's past orders for the React dashboard."""
    orders = Order.objects.filter(user=request.user).order_by("-ordered_date")
    
    order_data = []
    for order in orders:
        items = []
        for item in order.items.all():
            items.append({
                "product_name": item.product_name,
                "qty": item.product_qty,
                "price": str(item.product_price),
                "total": str(item.line_total()),
                "image": item.product.image_1.url if item.product and item.product.image_1 else None
            })
            
        order_data.append({
            "id": str(order.id),
            "date": order.ordered_date.strftime("%b %d, %Y"),
            "status": order.get_status_display(),
            "total_amount": str(order.amount_paid) if order.amount_paid else "0.00",
            "payment_id": order.payment_id,
            "items": items,
            "address": {
                "name": f"{order.address.first_name} {order.address.last_name}",
                "full_address": f"{order.address.address}, {order.address.city}, {order.address.state} - {order.address.pin_code}",
                "phone": order.address.phone_no
            }
        })
        
    return JsonResponse({"orders": order_data})

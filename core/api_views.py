"""
REST API Views for React Frontend
Additive only — existing views.py is untouched.
"""
import json
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q, Avg

from .models import Product, Wishlist, Review


# ─────────────────────────────────────────────
# Helper: serialize product to dict
# ─────────────────────────────────────────────
def product_to_dict(product, request=None, wishlist_ids=None):
    images = [product.image_1.url] if product.image_1 else []
    for img_field in ['image_2', 'image_3', 'image_4']:
        img = getattr(product, img_field, None)
        if img:
            images.append(img.url)

    in_wishlist = False
    if wishlist_ids is not None:
        in_wishlist = str(product.id) in [str(i) for i in wishlist_ids]

    return {
        "id":               str(product.id),
        "name":             product.name,
        "description":      product.description,
        "category":         product.category,
        "category_display": product.get_category_display(),
        "age_group":        product.age_group,
        "price":            str(product.price),
        "is_discount":      product.is_discount,
        "discount_price":   str(product.discount_price) if product.discount_price else None,
        "discount_pct":     product.discount_percentage(),
        "stock":            product.stock,
        "is_in_stock":      product.is_in_stock(),
        "is_featured":      product.is_featured,
        "no_of_sales":      product.no_of_sales,
        "avg_rating":       product.average_rating(),
        "review_count":     product.review_count(),
        "images":           images,
        "in_wishlist":      in_wishlist,
        "display_price":    str(product.get_display_price()),
    }


# ─────────────────────────────────────────────
# GET /api/home/
# ─────────────────────────────────────────────
@ensure_csrf_cookie
@require_GET
def api_home(request):
    """Homepage data: featured, best sellers, new arrivals, categories."""
    wishlist_ids = []
    if request.user.is_authenticated:
        wishlist_ids = list(Wishlist.objects.filter(user=request.user).values_list("product_id", flat=True))

    featured   = Product.objects.filter(is_featured=True, is_active=True)[:8]
    best       = Product.objects.filter(is_active=True).order_by("-no_of_sales")[:8]
    new        = Product.objects.filter(is_active=True).order_by("-created_at")[:8]
    discounted = Product.objects.filter(is_discount=True, is_active=True)[:4]

    categories = [
        {"key": "almonds",    "label": "Almonds",         "icon": "🥜"},
        {"key": "cashews",    "label": "Cashews",         "icon": "🌰"},
        {"key": "pistachios", "label": "Pistachios",      "icon": "💚"},
        {"key": "walnuts",    "label": "Walnuts",         "icon": "🤎"},
        {"key": "raisins",    "label": "Raisins & Dates", "icon": "🍇"},
        {"key": "mix_seeds",  "label": "Seeds & Mixes",   "icon": "🌱"},
    ]

    return JsonResponse({
        "featured_products": [product_to_dict(p, request, wishlist_ids) for p in featured],
        "best_sellers":      [product_to_dict(p, request, wishlist_ids) for p in best],
        "new_arrivals":      [product_to_dict(p, request, wishlist_ids) for p in new],
        "discounted":        [product_to_dict(p, request, wishlist_ids) for p in discounted],
        "categories":        categories,
    })


# ─────────────────────────────────────────────
# GET /api/products/
# ─────────────────────────────────────────────
@ensure_csrf_cookie
@require_GET
def api_products(request):
    """Product listing with category, search, sort, pagination."""
    qs = Product.objects.filter(is_active=True)

    category  = request.GET.get("category")
    search    = request.GET.get("q")
    sort      = request.GET.get("sort", "newest")
    age_group = request.GET.get("age_group")
    max_price = request.GET.get("max_price")

    if category:
        qs = qs.filter(category=category)
    if age_group:
        qs = qs.filter(age_group=age_group)
    if max_price:
        try:
            qs = qs.filter(price__lte=float(max_price))
        except ValueError:
            pass
    if search:
        qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))

    sort_map = {
        "price_asc":  "price",
        "price_desc": "-price",
        "popular":    "-no_of_sales",
        "newest":     "-created_at",
    }
    qs = qs.order_by(sort_map.get(sort, "-created_at"))

    paginator = Paginator(qs, 12)
    page_num  = request.GET.get("page", 1)
    page      = paginator.get_page(page_num)

    wishlist_ids = []
    if request.user.is_authenticated:
        wishlist_ids = list(Wishlist.objects.filter(user=request.user).values_list("product_id", flat=True))

    categories = [
        {"key": "almonds",    "label": "Almonds"},
        {"key": "cashews",    "label": "Cashews"},
        {"key": "pistachios", "label": "Pistachios"},
        {"key": "walnuts",    "label": "Walnuts"},
        {"key": "raisins",    "label": "Raisins & Dates"},
        {"key": "mix_seeds",  "label": "Seeds & Mixes"},
    ]

    return JsonResponse({
        "products":       [product_to_dict(p, request, wishlist_ids) for p in page.object_list],
        "total_pages":    paginator.num_pages,
        "current_page":   page.number,
        "has_next":       page.has_next(),
        "has_previous":   page.has_previous(),
        "total_count":    paginator.count,
        "categories":     categories,
    })


# ─────────────────────────────────────────────
# GET /api/products/<id>/
# ─────────────────────────────────────────────
@ensure_csrf_cookie
@require_GET
def api_product_detail(request, id):
    """Single product detail with reviews and related products."""
    from django.shortcuts import get_object_or_404
    product = get_object_or_404(Product, id=id, is_active=True)
    reviews = list(product.reviews.all().order_by("-created_at").values(
        "id", "rating", "title", "body", "created_at",
        "user__username", "user__first_name"
    ))
    for r in reviews:
        r["created_at"] = str(r["created_at"])
        r["user_name"] = r.pop("user__first_name") or r.pop("user__username")
        r.pop("user__username", None)

    related = Product.objects.filter(
        category=product.category, is_active=True
    ).exclude(id=product.id)[:4]

    wishlist_ids = []
    in_wishlist  = False
    user_review  = None
    if request.user.is_authenticated:
        wishlist_ids = list(Wishlist.objects.filter(user=request.user).values_list("product_id", flat=True))
        in_wishlist  = str(product.id) in [str(i) for i in wishlist_ids]
        ur = product.reviews.filter(user=request.user).first()
        if ur:
            user_review = {"id": ur.id, "rating": ur.rating, "title": ur.title, "body": ur.body}

    return JsonResponse({
        "product":      product_to_dict(product, request, wishlist_ids),
        "reviews":      reviews,
        "related":      [product_to_dict(p, request, wishlist_ids) for p in related],
        "in_wishlist":  in_wishlist,
        "user_review":  user_review,
        "avg_rating":   product.average_rating(),
    })


# ─────────────────────────────────────────────
# GET /api/cart/
# ─────────────────────────────────────────────
@ensure_csrf_cookie
@require_GET
def api_cart(request):
    """Return current cart contents."""
    from cart.cart import Cart
    cart  = Cart(request)
    items = []
    for product, qty in cart.products().items():
        items.append({
            **product_to_dict(product, request),
            "qty": qty,
            "line_total": str(product.get_display_price() * int(qty)),
        })
    return JsonResponse({"items": items, "total": str(cart.total()), "count": len(items)})


# ─────────────────────────────────────────────
# GET /api/user/
# ─────────────────────────────────────────────
@ensure_csrf_cookie
@require_GET
def api_user(request):
    """Return authenticated user info."""
    if request.user.is_authenticated:
        return JsonResponse({
            "authenticated": True,
            "username":      request.user.username,
            "first_name":    request.user.first_name,
            "email":         request.user.email,
            "is_superuser":  request.user.is_superuser,
        })
    return JsonResponse({"authenticated": False})


# ─────────────────────────────────────────────
# POST /api/contact/
# ─────────────────────────────────────────────
@ensure_csrf_cookie
@require_POST
def api_contact(request):
    """Handle contact form submission."""
    from .models import CustomerForm
    try:
        data = json.loads(request.body)
        CustomerForm.objects.create(
            name     = data.get("name", ""),
            email    = data.get("email", ""),
            phone_no = 0,
            subject  = data.get("subject", "Frontend Inquiry"),
            message  = data.get("message", ""),
        )
        return JsonResponse({"status": "success", "message": "Message sent."})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)

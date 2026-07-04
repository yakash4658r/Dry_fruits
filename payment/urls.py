from django.urls import path
from .views import *

urlpatterns = [
  path("checkout/", checkout, name="checkout"),
  path("billinginfo/<pk>/", billing_info, name="billing_info"),
  path("process_order/<pk>/", proccess_order, name="proccess_order"),
  path("mock_pay/<pk>/", mock_pay, name="mock_pay"),
  path("payment_verify/", payment_verify, name="payment_verify"),
  path("success/<pk>/", payment_success, name="payment_success"),
  path("update_address/<order_pk>/<pk>/", update_address, name="update_address"),
  path("api/my-orders/", api_my_orders, name="api_my_orders"),
]
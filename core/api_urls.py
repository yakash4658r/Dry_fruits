from django.urls import path
from . import api_views

urlpatterns = [
    path("api/home/",          api_views.api_home,           name="api_home"),
    path("api/products/",      api_views.api_products,       name="api_products"),
    path("api/products/<id>/", api_views.api_product_detail, name="api_product_detail"),
    path("api/cart/",          api_views.api_cart,           name="api_cart"),
    path("api/user/",          api_views.api_user,           name="api_user"),
]

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_com_pro.settings')
django.setup()
from core.models import Product

mapping = {
    "almonds": "product_images/almonds.png",
    "cashews": "product_images/cashews.png",
    "pistachios": "product_images/pistachios.png",
    "walnuts": "product_images/walnuts.png",
    "raisins": "product_images/dates.png",
    "mix_seeds": "product_images/seeds.png",
}

for p in Product.objects.all():
    if p.category in mapping:
        p.image_1 = mapping[p.category]
        # Remove any other duplicate/toy images
        p.image_2 = ""
        p.image_3 = ""
        p.image_4 = ""
        p.save()

print("All product images updated successfully!")

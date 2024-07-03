from django.contrib import admin
from .models import * 


admin.site.site_header='Ezayad admin'
admin.site.site_title='Ezayad'

@admin.register(UserAccount)
@admin.register(Company)
@admin.register(GovermentAccount)
@admin.register(Notification)
@admin.register(Enchaire)
@admin.register(Bid)
@admin.register(Voiture)
@admin.register(Message)
@admin.register(EnchaireChat)
@admin.register(Commentaire)
@admin.register(Payement)
class CustomUserAdmin(admin.ModelAdmin):
    pass
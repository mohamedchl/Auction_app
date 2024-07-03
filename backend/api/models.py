from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
import uuid
from datetime import datetime, timedelta, date
from django.utils.timezone import now

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_kwargs):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        username = email.split('@')[0]  # Automatically set username to the text before '@'
        user = self.model(email=email, username=username, **extra_kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_kwargs):
        user = self.create_user(
            email,
            password=password,
            **extra_kwargs
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    badges = (
        ('2', 'badge2'),
        ('3', 'badge3'),
        ('5', 'badge5'),
    )
    email = models.EmailField(
        verbose_name="Email",
        max_length=255,
        unique=True,
    )
    username = models.CharField(max_length=25, blank=True, null=True)
    first_name = models.CharField(max_length=25, blank=True, null=True)
    last_name = models.CharField(max_length=25, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    email_verified = models.BooleanField(default=False)  # Field for account confirmation
    badge = models.CharField(max_length=3, choices=badges, null=True)
    objects = UserAccountManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        """Return string representation of the object."""
        return self.email

    def has_perm(self, perm, obj=None):
        """Check if the user has a specific permission."""
        if self.is_admin:
            return True
        return super().has_perm(perm, obj)

    def has_module_perms(self, app_label):
        """Check if the user has permissions to view the app `app_label`."""
        if self.is_admin:
            return True
        return super().has_module_perms(app_label)

    @property
    def is_staff(self):
        """Check if the user is a member of staff."""
        return self.is_admin or self.is_staff


User = get_user_model()

class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Company(UserAccount):
    companyName = models.CharField(null=False, max_length=50)


class GovermentAccount(UserAccount):
    GovermentAccountName = models.CharField(null=False, max_length=50)


class Payement(models.Model):
    Reasons = (
        ('2', 'upgrade_b2'),
        ('3', 'upgrade_b3'),
        ('5', 'upgrade_b5'),
    )
    date = models.DateField(default=now, null=False)
    prix = models.IntegerField(null=False)
    reason = models.CharField(max_length=1)
    user = models.ForeignKey("UserAccount", related_name="payements", on_delete=models.CASCADE)

    def __str__(self):
        return f"Payement de {self.user.username} à {self.date}"


class Notification(models.Model):
    Type_notif = (
        ('1', 'Information'),
        ('2', 'Avertissement'),
    )
    type = models.CharField(max_length=1, choices=Type_notif)
    titre = models.CharField(max_length=100)
    date = models.DateTimeField(default=datetime.now)
    details = models.TextField()
    User = models.ManyToManyField("UserAccount", blank=True, related_name="notifications")

    def __str__(self):
        return self.titre


class Voiture(models.Model):
    nom = models.CharField(max_length=20, null=False)
    model = models.CharField(max_length=20, null=False)
    year = models.IntegerField(default=datetime.now().year, null=False)
    details = models.TextField()
    photo = models.ImageField(null=False)
    youtube_video = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.nom} {self.model} {self.year}"


class Enchaire(models.Model):
    Etat_Enchaire = (
        ('1', 'upcoming'),
        ('2', 'active'),
        ('3', 'finis'),
    )
    date_debut = models.DateField(default=date.today, null=False)
    date_fin = models.DateField(default=date.today, null=False)
    first_price = models.IntegerField(null=False)
    seller = models.ForeignKey("UserAccount", null=False, on_delete=models.CASCADE, related_name="enchaires_proprietes")
    winner = models.ForeignKey("UserAccount", null=True,blank=True, on_delete=models.CASCADE, related_name="enchaires_gagnée")
    #buyer = models.ManyToManyField("UserAccount", blank=True, related_name="enchaires")
    etat = models.CharField(choices=Etat_Enchaire, max_length=1,default='1')
    voiture = models.OneToOneField("Voiture", related_name="enchaire", null=False, on_delete=models.CASCADE)

    @property
    def timer(self):
        now = datetime.now()
        period = self.date_fin - now.date()
        days = period.days
        hours = period.seconds // 3600
        minutes = (period.seconds % 3600) // 60
        return f"{days} days, {hours} hours, and {minutes} minutes"

    def __str__(self):
        return f"Enchaire de '{self.voiture}' à {self.date_debut}"


class Commentaire(models.Model):
    text = models.TextField(null=False)
    date = models.DateTimeField(default=datetime.now)
    user = models.ForeignKey("UserAccount", null=False, on_delete=models.CASCADE, related_name="commentaires")
    enchaire = models.ForeignKey("Enchaire", null=False, on_delete=models.CASCADE, related_name="commentaires")

    def __str__(self):
        return f"Commentaire de {self.user.username} à l'enchaire '{self.enchaire}'"


class Bid(models.Model):
    date = models.DateTimeField(default=datetime.now)
    user = models.ForeignKey("UserAccount", null=False, on_delete=models.CASCADE, related_name="bids")
    enchaire = models.ForeignKey("Enchaire", null=False, on_delete=models.CASCADE, related_name="bids")
    prix = models.IntegerField(null=False)

    @property
    def period(self):
        period = self.enchaire.date_fin - self.date.date()
        days = period.days
        hours = period.seconds // 3600
        minutes = (period.seconds % 3600) // 60
        return f"{days} days, {hours} hours, and {minutes} minutes"

    def __str__(self):
        return f"bid de {self.user.username} à l'enchaire '{self.enchaire}'"
    
    def save(self, *args, **kwargs):
        enchaire = self.enchaire
        user = self.user

        if enchaire.winner is None:
            enchaire.winner = user
        else:
            highest_bid = enchaire.bids.order_by('-prix').first()
            if highest_bid and self.prix > highest_bid.prix:
                enchaire.winner = user

        enchaire.save()
        super().save(*args, **kwargs)


class EnchaireChat(models.Model):
    enchaire = models.ForeignKey("Enchaire", null=False, on_delete=models.CASCADE, related_name="chat_winner_seller")
    winner = models.ForeignKey("UserAccount", null=False, on_delete=models.CASCADE, related_name="chat_enchaire_gangée")
    seller = models.ForeignKey("UserAccount", null=False, on_delete=models.CASCADE, related_name="chat_enchaire_prop")

    def __str__(self):
        return f"chat de l'enchaire '{self.enchaire}'"


class Message(models.Model):
    text = models.TextField(null=False)
    date = models.DateTimeField(default=datetime.now)
    sender = models.ForeignKey("UserAccount", null=False, on_delete=models.CASCADE, related_name="messages_sent")
    receiver = models.ForeignKey("UserAccount", null=False, on_delete=models.CASCADE, related_name="messages_received")
    chat = models.ForeignKey("EnchaireChat", null=False, on_delete=models.CASCADE, related_name="messages")

    def __str__(self):
        return f"message envoyé par '{self.sender.username}' à '{self.receiver.username}'"

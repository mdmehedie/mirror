import hashlib
import hmac
import secrets

from django.conf import settings
from django.db import models
from rest_framework import authentication, exceptions


class MerchantApiKey(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='api_keys')
    name = models.CharField(max_length=100)
    prefix = models.CharField(max_length=16, unique=True, db_index=True)
    key_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    last_used_at = models.DateTimeField(null=True, blank=True)

    @classmethod
    def issue(cls, owner, name):
        raw_key = 'ecp_' + secrets.token_urlsafe(32)
        key = cls.objects.create(
            owner=owner,
            name=name,
            prefix=raw_key[:16],
            key_hash=hashlib.sha256(raw_key.encode()).hexdigest(),
        )
        return key, raw_key


class MerchantKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        raw_key = request.headers.get('X-Ecompho-Key', '')
        if not raw_key:
            raise exceptions.AuthenticationFailed('X-Ecompho-Key header is required.')
        if not raw_key.startswith('ecp_') or len(raw_key) < 40:
            raise exceptions.AuthenticationFailed('Invalid API key.')
        try:
            key = MerchantApiKey.objects.select_related('owner').get(prefix=raw_key[:16])
        except MerchantApiKey.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid API key.')
        digest = hashlib.sha256(raw_key.encode()).hexdigest()
        if not hmac.compare_digest(key.key_hash, digest) or not key.owner.is_active:
            raise exceptions.AuthenticationFailed('Invalid API key.')
        from django.utils import timezone
        MerchantApiKey.objects.filter(pk=key.pk).update(last_used_at=timezone.now())
        return key.owner, key

    def authenticate_header(self, request):
        return 'X-Ecompho-Key'

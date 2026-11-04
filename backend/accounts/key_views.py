from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .api_keys import MerchantApiKey


def key_data(key):
    return {
        'id': key.id,
        'name': key.name,
        'prefix': key.prefix,
        'created_at': key.created_at,
        'last_used_at': key.last_used_at,
    }


class ApiKeyListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        keys = MerchantApiKey.objects.filter(owner=request.user).order_by('-created_at')
        return Response([key_data(key) for key in keys])

    def post(self, request):
        name = str(request.data.get('name', '')).strip()
        if not name or len(name) > 100:
            return Response({'name': ['Enter a name of at most 100 characters.']}, status=400)
        key, raw_key = MerchantApiKey.issue(request.user, name)
        return Response({**key_data(key), 'key': raw_key}, status=status.HTTP_201_CREATED)


class ApiKeyDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        key = get_object_or_404(MerchantApiKey, pk=pk, owner=request.user)
        key.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

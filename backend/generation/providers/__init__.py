"""
AI Provider Factory for Virtual Try-On Generation.

This module provides a factory function to instantiate the appropriate
AI provider based on the provider name.

Supported Providers:
    - gemini: Google Gemini (placeholder implementation)
    - replicate: Replicate IDM-VTON (production-ready)

Usage:
    from generation.providers import get_provider

    provider = get_provider('replicate')
    job_id = provider.generate(model_url, garment_url, 'standard')
    status = provider.get_status(job_id)
    result = provider.get_result(job_id)
"""

from .base import BaseProvider
from .gemini_provider import GeminiProvider
from .replicate_provider import ReplicateProvider


# Provider registry mapping names to classes
PROVIDER_REGISTRY = {
    'gemini': GeminiProvider,
    'replicate': ReplicateProvider,
}


def get_provider(provider_name: str) -> BaseProvider:
    """
    Factory function to get an AI provider instance.

    Args:
        provider_name: Name of the provider ('gemini' or 'replicate')

    Returns:
        BaseProvider: Instantiated provider object

    Raises:
        ValueError: If provider name is not recognized

    Example:
        >>> provider = get_provider('replicate')
        >>> print(provider.name)
        'Replicate (IDM-VTON)'
    """
    # Normalize provider name to lowercase
    provider_name = provider_name.lower().strip()

    # Get provider class from registry
    provider_class = PROVIDER_REGISTRY.get(provider_name)

    if not provider_class:
        available = ', '.join(PROVIDER_REGISTRY.keys())
        raise ValueError(
            f"Unknown provider: '{provider_name}'. "
            f"Available providers: {available}"
        )

    # Instantiate and return provider
    try:
        return provider_class()
    except Exception as e:
        raise Exception(
            f"Failed to initialize {provider_name} provider: {str(e)}"
        )


def get_available_providers() -> list:
    """
    Get list of available provider names.

    Returns:
        list: List of provider names as strings

    Example:
        >>> providers = get_available_providers()
        >>> print(providers)
        ['gemini', 'replicate']
    """
    return list(PROVIDER_REGISTRY.keys())


def get_provider_info(provider_name: str) -> dict:
    """
    Get information about a specific provider.

    Args:
        provider_name: Name of the provider

    Returns:
        dict: Provider information

    Raises:
        ValueError: If provider name is not recognized
    """
    provider = get_provider(provider_name)

    info = {
        'name': provider.name,
        'identifier': provider_name,
    }

    # Add model-specific info if available
    if hasattr(provider, 'get_model_info'):
        info.update(provider.get_model_info())

    return info


# Export public API
__all__ = [
    'BaseProvider',
    'GeminiProvider',
    'ReplicateProvider',
    'get_provider',
    'get_available_providers',
    'get_provider_info',
]

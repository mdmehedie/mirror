#!/usr/bin/env python
"""
API Keys Verification Script
Run this to check if your API keys are properly configured.
"""

import os
import sys

# Add the parent directory to the path to import Django settings
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✓ Loaded .env file\n")
except ImportError:
    print("⚠ python-dotenv not installed. Install with: pip install python-dotenv\n")

# Check Django secret key
print("=" * 60)
print("DJANGO CONFIGURATION")
print("=" * 60)

django_secret = os.getenv('DJANGO_SECRET_KEY')
debug_mode = os.getenv('DEBUG', 'True')
allowed_hosts = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1')

print(f"Django Secret Key: {'✓ Set' if django_secret else '✗ Not set (using default)'}")
print(f"Debug Mode: {debug_mode}")
print(f"Allowed Hosts: {allowed_hosts}\n")

# Check AI Provider API Keys
print("=" * 60)
print("AI PROVIDER API KEYS")
print("=" * 60)

gemini_key = os.getenv('GEMINI_API_KEY')
replicate_token = os.getenv('REPLICATE_API_TOKEN')
fashn_key = os.getenv('FASHN_API_KEY')

print(f"\n1. Google Gemini API Key:")
if gemini_key:
    print(f"   ✓ Set (first 15 chars): {gemini_key[:15]}...")
    print(f"   Length: {len(gemini_key)} characters")
else:
    print(f"   ✗ Not set")
    print(f"   Get it from: https://aistudio.google.com/app/apikey")

print(f"\n2. Replicate API Token:")
if replicate_token:
    print(f"   ✓ Set (first 15 chars): {replicate_token[:15]}...")
    print(f"   Length: {len(replicate_token)} characters")
    # Test Replicate connection
    try:
        import replicate
        os.environ['REPLICATE_API_TOKEN'] = replicate_token
        client = replicate.Client(api_token=replicate_token)
        print(f"   ✓ Connection test: SUCCESS")
    except ImportError:
        print(f"   ⚠ replicate package not installed. Install with: pip install replicate")
    except Exception as e:
        print(f"   ✗ Connection test failed: {str(e)[:50]}...")
else:
    print(f"   ✗ Not set")
    print(f"   Get it from: https://replicate.com/account/api-tokens")
    print(f"   Note: This is REQUIRED for actual virtual try-on generation")

print(f"\n3. FASHN API Key (optional):")
if fashn_key:
    print(f"   ✓ Set (first 15 chars): {fashn_key[:15]}...")
    print(f"   Length: {len(fashn_key)} characters")
else:
    print(f"   ✗ Not set (optional)")
    print(f"   Get it from: https://fashn.ai")

# Test Gemini connection
print("\n" + "=" * 60)
print("CONNECTION TESTS")
print("=" * 60)

if gemini_key:
    print(f"\nTesting Google Gemini connection...")
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        print(f"   ✓ Gemini API configured successfully")
        print(f"   Model: gemini-2.0-flash-exp")
    except ImportError:
        print(f"   ⚠ google-generativeai package not installed")
        print(f"   Install with: pip install google-generativeai")
    except Exception as e:
        print(f"   ✗ Configuration failed: {str(e)[:50]}...")

# Summary
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)

has_gemini = bool(gemini_key)
has_replicate = bool(replicate_token)

if has_gemini and has_replicate:
    print("\n✓ All required API keys are configured!")
    print("\nYou can now:")
    print("  1. Use 'replicate' provider for actual virtual try-on")
    print("  2. Use 'gemini' provider for testing (limited functionality)")
elif has_replicate:
    print("\n✓ Replicate API token is configured!")
    print("⚠ Gemini API key is missing but not critical")
    print("\nYou can use 'replicate' provider for virtual try-on")
elif has_gemini:
    print("\n⚠ Only Gemini API key is configured")
    print("✗ Replicate API token is MISSING")
    print("\nYou need Replicate for actual virtual try-on generation")
    print("Get it from: https://replicate.com/account/api-tokens")
else:
    print("\n✗ No API keys configured!")
    print("\nPlease set up your API keys:")
    print("  1. Copy backend/.env.example to backend/.env")
    print("  2. Add your API keys to backend/.env")
    print("  3. Restart your Django server")
    print("\nSee API_KEYS_SETUP.md for detailed instructions")

print("\n" + "=" * 60)
print("\nFor detailed setup instructions, see: API_KEYS_SETUP.md")
print("")


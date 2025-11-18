#!/usr/bin/env python3
"""
Test script for Generation API endpoints and Celery integration.
"""
import os
import sys
import time
import requests
from io import BytesIO
from PIL import Image as PILImage

# Django setup
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecompho.settings')
django.setup()

from django.contrib.auth import get_user_model

# Configuration
BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/api"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

User = get_user_model()


def print_success(message):
    print(f"{GREEN}✓ {message}{RESET}")


def print_error(message):
    print(f"{RED}✗ {message}{RESET}")


def print_info(message):
    print(f"{BLUE}ℹ {message}{RESET}")


def print_warning(message):
    print(f"{YELLOW}⚠ {message}{RESET}")


def create_test_user():
    """Create or get test user."""
    print_info("Setting up test user...")

    username = "testuser"
    email = "test@example.com"
    password = "testpass123"

    # Delete existing user if exists
    User.objects.filter(username=username).delete()

    # Create new user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    print_success(f"Test user created: {username}")
    return username, password


def get_jwt_token(username, password):
    """Get JWT access token."""
    print_info("Getting JWT token...")

    response = requests.post(
        f"{API_BASE}/auth/login/",
        json={"username": username, "password": password}
    )

    if response.status_code == 200:
        token = response.json()["tokens"]["access"]
        print_success("JWT token obtained")
        return token
    else:
        print_error(f"Failed to get token: {response.status_code}")
        print(response.text)
        return None


def create_test_image(width=800, height=800, color='blue'):
    """Create a test image in memory."""
    img = PILImage.new('RGB', (width, height), color=color)
    img_bytes = BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes


def test_image_upload(token):
    """Test image upload endpoint."""
    print_info("\nTesting image upload endpoint...")

    headers = {"Authorization": f"Bearer {token}"}

    # Test 1: Upload model image
    print_info("  Uploading model image...")
    model_img = create_test_image(800, 800, 'lightblue')

    response = requests.post(
        f"{API_BASE}/generation/images/upload/",
        headers=headers,
        files={"file": ("model.jpg", model_img, "image/jpeg")},
        data={"image_type": "model_image"}
    )

    if response.status_code == 201:
        model_data = response.json()
        print_success(f"  Model image uploaded: {model_data['id']}")
        print_info(f"    Dimensions: {model_data['width']}x{model_data['height']}")
        model_id = model_data['id']
    else:
        print_error(f"  Failed to upload model image: {response.status_code}")
        print(response.text)
        return None, None

    # Test 2: Upload garment image
    print_info("  Uploading garment image...")
    garment_img = create_test_image(800, 800, 'lightcoral')

    response = requests.post(
        f"{API_BASE}/generation/images/upload/",
        headers=headers,
        files={"file": ("garment.jpg", garment_img, "image/jpeg")},
        data={"image_type": "garment_image"}
    )

    if response.status_code == 201:
        garment_data = response.json()
        print_success(f"  Garment image uploaded: {garment_data['id']}")
        print_info(f"    Dimensions: {garment_data['width']}x{garment_data['height']}")
        garment_id = garment_data['id']
    else:
        print_error(f"  Failed to upload garment image: {response.status_code}")
        print(response.text)
        return model_id, None

    # Test 3: Invalid image type (should fail)
    print_info("  Testing validation - invalid type...")
    invalid_img = create_test_image(100, 100)

    response = requests.post(
        f"{API_BASE}/generation/images/upload/",
        headers=headers,
        files={"file": ("invalid.jpg", invalid_img, "image/jpeg")},
        data={"image_type": "invalid"}
    )

    if response.status_code == 400:
        print_success("  Validation working: Rejected invalid type")
    else:
        print_warning(f"  Validation might not be working: {response.status_code}")

    # Test 4: Too small image (should fail)
    print_info("  Testing validation - image too small...")
    small_img = create_test_image(200, 200)

    response = requests.post(
        f"{API_BASE}/generation/images/upload/",
        headers=headers,
        files={"file": ("small.jpg", small_img, "image/jpeg")},
        data={"image_type": "model_image"}
    )

    if response.status_code == 400:
        print_success("  Validation working: Rejected small image")
    else:
        print_warning(f"  Validation might not be working: {response.status_code}")

    return model_id, garment_id


def test_generation_creation(token, model_id, garment_id):
    """Test generation creation endpoint."""
    print_info("\nTesting generation creation endpoint...")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Test 1: Create generation with Replicate
    print_info("  Creating generation (Replicate, draft quality)...")

    payload = {
        "name": "Test Try-On Generation",
        "model_image_id": model_id,
        "garment_image_id": garment_id,
        "provider": "replicate",
        "quality_preset": "draft"
    }

    response = requests.post(
        f"{API_BASE}/generation/generations/",
        headers=headers,
        json=payload
    )

    if response.status_code == 201:
        generation_data = response.json()
        generation_id = generation_data['id']
        print_success(f"  Generation created: {generation_id}")
        print_info(f"    Status: {generation_data['status']}")
        print_info(f"    Provider: {generation_data['provider']}")
        return generation_id
    else:
        print_error(f"  Failed to create generation: {response.status_code}")
        print(response.text)
        return None


def test_generation_detail(token, generation_id):
    """Test generation detail endpoint."""
    print_info("\nTesting generation detail endpoint...")

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(
        f"{API_BASE}/generation/generations/{generation_id}/",
        headers=headers
    )

    if response.status_code == 200:
        data = response.json()
        print_success("  Generation detail retrieved")
        print_info(f"    ID: {data['id']}")
        print_info(f"    Name: {data['name']}")
        print_info(f"    Status: {data['status']}")
        print_info(f"    Provider: {data['provider']}")
        return data
    else:
        print_error(f"  Failed to get generation detail: {response.status_code}")
        return None


def test_generation_list(token):
    """Test generation list endpoint."""
    print_info("\nTesting generation list endpoint...")

    headers = {"Authorization": f"Bearer {token}"}

    # Test 1: Get all generations
    print_info("  Getting all generations...")
    response = requests.get(
        f"{API_BASE}/generation/generations/",
        headers=headers
    )

    if response.status_code == 200:
        data = response.json()
        print_success(f"  Retrieved {len(data)} generation(s)")
    else:
        print_error(f"  Failed to get generations: {response.status_code}")

    # Test 2: Filter by status
    print_info("  Testing filter by status...")
    response = requests.get(
        f"{API_BASE}/generation/generations/?status=pending",
        headers=headers
    )

    if response.status_code == 200:
        data = response.json()
        print_success(f"  Filter working: {len(data)} pending generation(s)")
    else:
        print_error(f"  Failed to filter generations: {response.status_code}")

    # Test 3: Sort by created_at
    print_info("  Testing sort by created_at...")
    response = requests.get(
        f"{API_BASE}/generation/generations/?sort_by=-created_at",
        headers=headers
    )

    if response.status_code == 200:
        print_success("  Sorting working")
    else:
        print_error(f"  Failed to sort generations: {response.status_code}")


def monitor_generation(token, generation_id, max_wait=60):
    """Monitor generation progress."""
    print_info("\nMonitoring generation progress...")

    headers = {"Authorization": f"Bearer {token}"}
    start_time = time.time()

    while time.time() - start_time < max_wait:
        response = requests.get(
            f"{API_BASE}/generation/generations/{generation_id}/",
            headers=headers
        )

        if response.status_code == 200:
            data = response.json()
            status = data['status']

            if status == 'completed':
                print_success(f"  Generation completed!")
                print_info(f"    Result URL: {data.get('result_image_url', 'N/A')}")
                if data.get('processing_time_seconds'):
                    print_info(f"    Processing time: {data['processing_time_seconds']}s")
                return True
            elif status == 'failed':
                print_error(f"  Generation failed!")
                print_error(f"    Error: {data.get('error_message', 'Unknown error')}")
                return False
            else:
                print_info(f"  Status: {status} (waiting...)")
                time.sleep(5)
        else:
            print_error(f"  Failed to check status: {response.status_code}")
            return False

    print_warning(f"  Timeout after {max_wait}s (generation may still be processing)")
    return False


def main():
    """Run all tests."""
    print("\n" + "="*60)
    print("  PHASE 4 API & CELERY INTEGRATION TESTS")
    print("="*60)

    # Step 1: Setup
    username, password = create_test_user()

    # Step 2: Get JWT token
    token = get_jwt_token(username, password)
    if not token:
        print_error("Cannot proceed without authentication token")
        return

    # Step 3: Test image upload
    model_id, garment_id = test_image_upload(token)
    if not model_id or not garment_id:
        print_error("Cannot proceed without uploaded images")
        return

    # Step 4: Test generation creation
    generation_id = test_generation_creation(token, model_id, garment_id)
    if not generation_id:
        print_error("Cannot proceed without generation")
        return

    # Step 5: Test generation detail
    test_generation_detail(token, generation_id)

    # Step 6: Test generation list
    test_generation_list(token)

    # Step 7: Monitor generation (optional, will take time)
    print_info("\nWould you like to monitor the generation progress? (This may take 15-30s)")
    print_info("Note: Gemini provider will fail (placeholder), Replicate will work with real API key")
    # For automated testing, skip monitoring
    # monitor_generation(token, generation_id, max_wait=60)

    print("\n" + "="*60)
    print_success("ALL TESTS COMPLETED!")
    print("="*60)
    print_info("Note: To fully test Celery integration, check the Celery worker logs")
    print_info("The generation will continue processing in the background")
    print("\n")


if __name__ == "__main__":
    # Check if Django server is running
    try:
        response = requests.get(BASE_URL, timeout=2)
        main()
    except requests.exceptions.ConnectionError:
        print_error("Django development server is not running!")
        print_info("Please run: python3 manage.py runserver")
        print_info("Then run this script again")
        sys.exit(1)

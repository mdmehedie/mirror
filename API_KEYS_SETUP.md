# API Keys Setup Guide

This guide will help you set up the required API keys for the Ecompho Virtual Try-On Platform.

## Required API Keys

### 1. Google Gemini API Key

**What it's for:** The Gemini provider uses Google's Generative AI for image processing.

**How to get it:**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the generated API key

**Note:** Google Gemini is currently a placeholder provider. For actual virtual try-on, use Replicate (see below).

### 2. Replicate API Token (Recommended)

**What it's for:** Replicate provides the actual virtual try-on AI models (IDM-VTON).

**How to get it:**

1. Go to [Replicate](https://replicate.com/)
2. Sign up or log in
3. Go to your [account settings](https://replicate.com/account/api-tokens)
4. Copy your API token (it starts with `r8_...`)
5. You'll need to add payment info as try-on models are paid

**Pricing:** IDM-VTON costs approximately $0.02-0.05 per generation.

## Setting Up Environment Variables

### Option 1: Using a `.env` file (Development)

1. Create a `.env` file in the backend directory:
   ```bash
   cd /Volumes/My\ Files/personal/Texon/Ecompho/backend
   touch .env
   ```

2. Add your API keys to the `.env` file:
   ```bash
   # Django settings
   DJANGO_SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # AI Provider API Keys
   GEMINI_API_KEY=your-gemini-api-key-here
   REPLICATE_API_TOKEN=your-replicate-token-here
   
   # Database (optional, uses SQLite by default)
   # DATABASE_URL=postgresql://user:password@localhost:5432/ecompho
   
   # Celery (optional)
   # CELERY_BROKER_URL=redis://localhost:6379/0
   # CELERY_RESULT_BACKEND=redis://localhost:6379/0
   ```

3. Install python-dotenv (if not already installed):
   ```bash
   pip install python-dotenv
   ```

4. Make sure your settings.py loads the .env file (already configured in your project)

### Option 2: Export in Terminal (Temporary)

For quick testing, you can export the variables in your terminal:

```bash
# Export API keys
export GEMINI_API_KEY="your-gemini-api-key-here"
export REPLICATE_API_TOKEN="your-replicate-token-here"

# Then start your server
cd backend
python manage.py runserver
```

Note: These will only last for the current terminal session.

### Option 3: System Environment Variables (macOS)

For permanent system-wide setup:

1. Edit your shell profile:
   ```bash
   nano ~/.zshrc
   ```

2. Add these lines at the end:
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key-here"
   export REPLICATE_API_TOKEN="your-replicate-token-here"
   ```

3. Save and reload:
   ```bash
   source ~/.zshrc
   ```

## Verifying Your Setup

### Check if API keys are loaded:

Create a test script `check_keys.py` in the backend directory:

```python
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Check API keys
gemini_key = os.getenv('GEMINI_API_KEY')
replicate_token = os.getenv('REPLICATE_API_TOKEN')

print("API Keys Status:")
print(f"Gemini API Key: {'✓ Set' if gemini_key else '✗ Not set'}")
print(f"Replicate Token: {'✓ Set' if replicate_token else '✗ Not set'}")

if gemini_key:
    print(f"  - Gemini Key (first 10 chars): {gemini_key[:10]}...")
if replicate_token:
    print(f"  - Replicate Token (first 10 chars): {replicate_token[:10]}...")
```

Run it:
```bash
cd backend
python check_keys.py
```

### Test Replicate connection:

```python
import os
import replicate

# Set your token
os.environ['REPLICATE_API_TOKEN'] = 'your-token-here'

# Test connection
try:
    client = replicate.Client(api_token=os.environ['REPLICATE_API_TOKEN'])
    print("✓ Replicate connection successful!")
except Exception as e:
    print(f"✗ Replicate connection failed: {e}")
```

## Choosing a Provider

When creating a generation request through the API, you specify the provider:

```json
{
  "model_image_id": "uuid-here",
  "garment_image_id": "uuid-here",
  "provider": "replicate",  // or "gemini"
  "quality_preset": "standard"
}
```

**Recommendations:**
- **Use `replicate`** for actual virtual try-on (requires API token and payment)
- **Use `gemini`** only for testing the API flow (won't produce real results yet)

## Troubleshooting

### "GEMINI_API_KEY not found in environment"
- Make sure you've created the `.env` file in the correct directory (backend/)
- Check that the key name is exactly `GEMINI_API_KEY` (case-sensitive)
- Restart your Django server after adding the key

### "REPLICATE_API_TOKEN not found in environment"
- Same steps as above, but for `REPLICATE_API_TOKEN`

### "Failed to download image from..."
- This error has been fixed in the latest update
- The providers now correctly handle both local file paths and URLs

### "Insufficient credits" or "Payment required"
- Go to [Replicate Billing](https://replicate.com/account/billing)
- Add a payment method
- Add credits to your account (minimum $5 recommended)

## Security Best Practices

1. **Never commit API keys to Git:**
   - Add `.env` to `.gitignore` (should already be there)
   - Never share your API keys in public repositories

2. **Use different keys for development and production**

3. **Rotate keys regularly**

4. **Monitor usage:**
   - Check [Replicate Dashboard](https://replicate.com/account)
   - Set up billing alerts

## Production Deployment

For production (e.g., Heroku, AWS, etc.), set environment variables through your hosting platform:

**Heroku:**
```bash
heroku config:set GEMINI_API_KEY=your-key-here
heroku config:set REPLICATE_API_TOKEN=your-token-here
```

**Docker:**
```yaml
environment:
  - GEMINI_API_KEY=your-key-here
  - REPLICATE_API_TOKEN=your-token-here
```

## Next Steps

1. Get your API keys from the links above
2. Add them to your `.env` file
3. Restart your Django server
4. Test with a generation request
5. Monitor your usage and costs

For more information, see:
- [Google AI Studio Documentation](https://ai.google.dev/tutorials/python_quickstart)
- [Replicate Documentation](https://replicate.com/docs)
- [Project README](README.md)


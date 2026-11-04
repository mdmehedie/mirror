# 🔧 How to Restart Services After Code Changes

## The Problem
When you update Python code in your Django project, **running processes continue to use the old code loaded in memory**. This is why you're still seeing the old error message even though the code has been fixed.

## The Solution: Restart Your Services

### Quick Method (If you're using the start script)

1. **Stop all services:**
   ```bash
   # Press Ctrl+C in each terminal running Django/Celery
   # Or kill processes:
   pkill -f "manage.py runserver"
   pkill -f "celery -A ecompho worker"
   ```

2. **Start services with the main script:**
   ```bash
   cd "/Volumes/My Files/personal/Texon/Ecompho"
   ./start.sh
   ```

### Manual Method (Step by step)

#### Terminal 1: Start Django
```bash
cd "/Volumes/My Files/personal/Texon/Ecompho/backend"
source venv/bin/activate
python manage.py runserver
```

#### Terminal 2: Start Celery
```bash
cd "/Volumes/My Files/personal/Texon/Ecompho/backend"
source venv/bin/activate
celery -A ecompho worker --loglevel=info
```

## ✅ Verify the Fix is Working

After restarting, the error message should change from:
```
❌ OLD: "Failed to download image from /var/www/..."
```

To (if there's a file error):
```
✅ NEW: "Failed to load image from /var/www/..."
```

Or better yet, **no error at all** if the file exists and is readable.

## 🔍 What Was Fixed

The `gemini_provider.py` now correctly:

1. **Checks if path is local** (doesn't start with `http://` or `https://`)
2. **Reads directly from disk** for local paths
3. **Downloads via HTTP** only for actual URLs

### Fixed Code:
```python
def _download_image(self, url_or_path: str) -> bytes:
    try:
        # Check if it's a local file path
        if not url_or_path.startswith('http://') and not url_or_path.startswith('https://'):
            # Read from local file
            with open(url_or_path, 'rb') as f:
                return f.read()
        
        # Download from URL
        response = httpx.get(url_or_path, timeout=30.0, follow_redirects=True)
        response.raise_for_status()
        return response.content
    except Exception as e:
        raise Exception(f"Failed to load image from {url_or_path}: {str(e)}")
```

## 🚨 Important Notes

### On Your Server (`/var/www/Ecompho/backend/`)
If you're running this on a production/staging server:

1. **Update the code on the server:**
   ```bash
   cd /var/www/Ecompho
   git pull  # or however you deploy
   ```

2. **Restart services:**
   ```bash
   # Restart Django (depends on your setup)
   sudo systemctl restart gunicorn  # or uwsgi, or supervisor
   
   # Restart Celery
   sudo systemctl restart celery
   # or
   sudo supervisorctl restart celery
   ```

3. **Check file permissions:**
   ```bash
   # Ensure the web user can read media files
   ls -la /var/www/Ecompho/backend/media/images/2025/12/20/
   
   # Fix permissions if needed
   sudo chown -R www-data:www-data /var/www/Ecompho/backend/media/
   sudo chmod -R 755 /var/www/Ecompho/backend/media/
   ```

### File Path Issues to Check

If you still get errors after restarting, verify:

1. **File exists:**
   ```bash
   ls -la /var/www/Ecompho/backend/media/images/2025/12/20/IMG_8802copy_tmIz68d.webp
   ```

2. **File is readable:**
   ```bash
   cat /var/www/Ecompho/backend/media/images/2025/12/20/IMG_8802copy_tmIz68d.webp > /dev/null
   echo $?  # Should output 0 if readable
   ```

3. **User running Celery has permissions:**
   ```bash
   # Check which user runs Celery
   ps aux | grep celery
   
   # Test reading as that user
   sudo -u <celery-user> cat /var/www/Ecompho/backend/media/images/2025/12/20/IMG_8802copy_tmIz68d.webp > /dev/null
   ```

## 📋 Troubleshooting Checklist

- [ ] Code updated in `gemini_provider.py`
- [ ] Django server restarted
- [ ] Celery workers restarted
- [ ] File exists at the specified path
- [ ] File has correct permissions (readable by web/celery user)
- [ ] Error message changed to "Failed to load" (not "Failed to download")

## 🎯 Expected Behavior After Fix

### For Local Development:
- ✅ Reads images directly from `/Volumes/My Files/.../media/images/`
- ✅ No HTTP requests for local files

### For Server Deployment:
- ✅ Reads images directly from `/var/www/Ecompho/backend/media/images/`
- ✅ No HTTP requests for local files

### For Remote URLs (if ever needed):
- ✅ Downloads images via HTTP/HTTPS
- ✅ Follows redirects

---

**Next Step:** Restart your Django and Celery services, then try the generation again!


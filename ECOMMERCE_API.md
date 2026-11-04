# Ecommerce integration API

The account owner creates an API key at `/integrations` in the Ecompho portal. The full key is shown once. Store it as a secret in the ecommerce **server**, never in browser code. The ecommerce server authenticates its own shoppers and keeps the association between each shopper and the Ecompho generation ID. Ecompho does not store ecommerce shopper IDs.

## Create a generation

`POST /api/v1/generations/` with `X-Ecompho-Key: <key>` and `multipart/form-data`:

| Field | Required | Value |
| --- | --- | --- |
| `model_image` | Yes | JPEG, PNG, or WebP person image |
| `garment_image` | Yes | JPEG, PNG, or WebP garment image |
| `name` | No | Label, up to 200 characters |
| `category` | No | `upper_body` (default), `lower_body`, or `dresses` |
| `quality_preset` | No | `draft`, `standard` (default), or `high` |
| `garment_description` | No | Optional text |

Each image must be at least 512 × 512 pixels and at most 10 MB. Generation uses Replicate. A Celery worker and its broker must be running.

```bash
curl -X POST 'http://localhost:8000/api/v1/generations/' \
  -H 'X-Ecompho-Key: YOUR_API_KEY' \
  -F 'model_image=@person.jpg' \
  -F 'garment_image=@shirt.jpg' \
  -F 'category=upper_body'
```

The API returns HTTP 202 with JSON containing `id`, `status: "pending"`, `result_image_url: null`, and timestamps. Save `id` in the ecommerce database with the shopper record.

## Check status and get the image

`GET /api/v1/generations/{id}/` with the same key returns JSON. Poll until `status` is `completed`, `failed`, or `closed`. When completed, `result_image_url` contains a URL such as `/api/v1/generations/{id}/image/`. Fetch that URL from the ecommerce server with `X-Ecompho-Key`; it returns image bytes and an image content type. The ecommerce server can store the bytes or stream them to its authenticated shopper.

The owner can view all generations and counts in the Ecompho portal at `/dashboard` and `/gallery`. The portal uses account login, while the external API uses the key. Revoking a key immediately stops new requests that use it.

Errors: 400 for invalid fields or images, 401 for missing or invalid key, and 404 for a generation outside the key owner's account.

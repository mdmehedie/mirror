# Docker deployment

The root `docker-compose.yml` runs five services: frontend Nginx, Django/Gunicorn backend, Celery worker, PostgreSQL, and Redis. The frontend and API share one public origin. The database, Redis, and backend are not published to the host. Named volumes keep database data, Redis data, uploaded images, and Django static files across container restarts.

## Configure

1. Install Docker Engine and the Docker Compose plugin on the server.
2. Copy `.env.example` to `.env` in the project root.
3. Set a long random `DJANGO_SECRET_KEY`, a strong `DB_PASSWORD`, and `REPLICATE_API_TOKEN` in `.env`.
4. For a real domain, set `ALLOWED_HOSTS=your-domain.com`, `CSRF_TRUSTED_ORIGINS=https://your-domain.com`, and `CORS_ALLOWED_ORIGINS=https://your-domain.com`. Set `FRONTEND_PORT` to the host port your HTTPS reverse proxy will reach. The proxy should send the original `Host` and `X-Forwarded-Proto` headers. Use HTTPS for public API traffic and API keys.

The `.env` file is ignored by Git and Docker build contexts. Do not put secrets in `frontend/.env` or `VITE_*` variables; Vite embeds those values in the public JavaScript bundle.

## Start

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend worker
```

Open `http://localhost:8080` for the default local setup. The backend runs migrations and collects static files before Gunicorn starts. Celery starts after the backend is healthy.

To create a Django admin account:

```bash
docker compose exec backend python manage.py createsuperuser
```

To deploy an update, pull the new code and run `docker compose up -d --build` again. Do not remove named volumes unless you intend to delete stored data. Back up the PostgreSQL and media volumes before server maintenance.

The ecommerce API is available through the same origin at `/api/v1/generations/`; the account owner can create an API key at `/integrations`. See `ECOMMERCE_API.md` for requests and responses.

The existing frontend displays uploaded images through `/media/`, which this Nginx configuration serves publicly. If those photos must be private, add authenticated or signed media delivery before exposing the site to customers.

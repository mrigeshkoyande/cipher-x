# CIPHER-X Production Deployment Guide

This guide provides step-by-step instructions for deploying CIPHER-X to production environments.

---

## 1. Quick Start with Docker Compose (Recommended)

Run the full stack (FastAPI backend + Nginx Vite frontend) with a single command:

```bash
# 1. Clone the repository
git clone https://github.com/mrigeshkoyande/cipher-x.git
cd cipher-x

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your production SECRET_KEY and API keys

# 3. Launch full stack container suite
docker-compose up -d --build
```

Access services:
- **Frontend SPA**: [http://localhost](http://localhost)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/ready](http://localhost:8000/ready)

---

## 2. Cloud Platform Deployments

### A. Deploy Backend on Render / Railway / Azure App Service
1. Connect repository `mrigeshkoyande/cipher-x`.
2. **Build Command**: `pip install -r backend/requirements.txt`
3. **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `REQUIRE_AUTH=true`
   - `SECRET_KEY=<your-secret-key>`
   - `ALLOWED_ORIGINS=https://your-frontend.vercel.app`

### B. Deploy Frontend on Vercel / Netlify
1. Root Directory: `frontend`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set `VITE_API_BASE_URL` environment variable pointing to your deployed backend URL.

---

## 3. Kubernetes Deployment (k8s)

Kubernetes manifests are located under `deploy/k8s/`:

```bash
kubectl apply -f deploy/k8s/
```

---

## 4. Security Hardening Checklist for Production

- [x] **CORS Configuration**: Restricted to explicit `ALLOWED_ORIGINS`.
- [x] **JWT Security**: Secret key populated from environment variables; invalid tokens rejected with HTTP 401.
- [x] **Security Headers**: Standard OWASP headers enforced (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- [x] **Database Isolation**: Database files ignored from source control.
- [x] **Health Probes**: Liveness (`/health`) and Readiness (`/ready`) endpoints configured for container orchestrators.

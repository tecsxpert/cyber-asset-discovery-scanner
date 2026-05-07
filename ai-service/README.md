# AI Service — Tool-95: Cyber Asset Discovery Scanner

Flask-based AI microservice using Groq (LLaMA-3.3-70b) for cybersecurity asset analysis.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Python 3.11 |
| Framework | Flask 3.x |
| AI Model | LLaMA-3.3-70b-versatile via Groq API |
| Rate Limiting | flask-limiter (30 req/min) |
| Port | 5000 |

---

## Prerequisites

- Python 3.11+
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Docker (optional, for containerised run)

---

## Setup

### 1. Clone and enter the ai-service folder
```bash
cd ai-service
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp ../.env.example .env
```

Edit `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
AI_PORT=5000
FLASK_DEBUG=false
```

### 5. Verify Groq API works
```bash
python test_groq.py
```
Expected output: `Groq API is working correctly.`

### 6. Run the service
```bash
python app.py
```

Service starts at: `http://localhost:5000`

---

## Running with Docker
```bash
docker build -t tool95-ai-service .
docker run -p 5000:5000 --env-file ../.env tool95-ai-service
```

Or use the root `docker-compose up` to start all services together.

---

## API Reference

### GET /health
Returns AI service status and uptime.

**Response:**
```json
{
  "status": "ok",
  "model": "llama-3.3-70b-versatile",
  "provider": "Groq",
  "uptime_seconds": 3600,
  "timestamp": "2026-05-09T10:00:00+00:00"
}
```

---

### POST /generate-report
Generates a structured security report for a cyber asset.

**Request:**
```json
{
  "asset_data": {
    "name": "web-server-01",
    "ip": "192.168.1.100",
    "type": "Web Server",
    "os": "Ubuntu 22.04",
    "open_ports": [80, 443, 22],
    "risk_score": 7.4
  }
}
```

**Response (success):**
```json
{
  "title": "Security Report for web-server-01",
  "summary": "web-server-01 presents moderate-to-high risk due to exposed management port and outdated dependencies.",
  "overview": "This Ubuntu 22.04 web server is accessible on ports 80, 443, and 22. The presence of SSH on port 22 represents an attack vector if not properly restricted.",
  "key_items": [
    "SSH port 22 is open and publicly accessible",
    "Risk score 7.4 indicates significant exposure",
    "HTTP (port 80) should redirect to HTTPS",
    "Operating system patch level unknown"
  ],
  "recommendations": [
    "Restrict SSH access to known IP ranges using firewall rules",
    "Implement fail2ban or equivalent to block brute-force SSH attempts",
    "Force HTTPS redirect and disable plain HTTP traffic"
  ],
  "generated_at": "2026-05-09T10:23:45+00:00",
  "is_fallback": false
}
```

**Response (fallback — when Groq is unavailable):**
```json
{
  "title": "Security Report (Fallback)",
  "summary": "AI service is temporarily unavailable. Please try again later.",
  "is_fallback": true,
  "generated_at": "2026-05-09T10:23:45+00:00"
}
```

**Error responses:**

| Status | Meaning |
|--------|---------|
| 400 | Missing `asset_data` or empty body |
| 400 + `INJECTION_DETECTED` | Prompt injection attempt blocked |
| 429 | Rate limit exceeded (30 req/min) |

---

## Running Tests
```bash
pytest tests/ -v
```

All 8 tests should pass. Groq API is mocked — no live network access required.

---

## Security

See [SECURITY.md](./SECURITY.md) for full threat model, test results, and findings.

**Key protections:**
- Input sanitization (HTML stripped)
- Prompt injection detection (regex patterns)
- Rate limiting (30 requests/minute per IP)
- All Groq calls wrapped with try/except + fallback
- No PII in prompts
- API key stored in `.env` only (never committed)

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key | `gsk_abc123...` |
| `AI_PORT` | No | Port to run on (default: 5000) | `5000` |
| `FLASK_DEBUG` | No | Enable debug mode (default: false) | `false` |

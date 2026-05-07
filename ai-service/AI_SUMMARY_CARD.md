# AI SUMMARY CARD — Tool-95
## Cyber Asset Discovery Scanner | Demo Day: 9 May 2026

---

## 🤖 AI TECH STACK

| Component     | Technology                    |
|---------------|-------------------------------|
| AI Model      | LLaMA 3.3 70B (via Groq API)  |
| AI Framework  | Flask 3.x (Python 3.11)       |
| AI Port       | http://localhost:5000         |
| Rate Limit    | 30 requests / minute          |
| Retry Logic   | 3 retries with backoff        |

---

## 📡 AI ENDPOINTS

### POST /generate-report
**Input:**
```json
{
  "asset_data": {
    "name": "web-server-01",
    "ip": "10.0.0.5",
    "type": "Web Server",
    "risk_score": 7.4
  }
}
```
**Output:**
```json
{
  "title": "Security Report for web-server-01",
  "summary": "...",
  "overview": "...",
  "key_items": ["...", "..."],
  "recommendations": ["...", "..."],
  "generated_at": "2026-05-09T10:00:00Z",
  "is_fallback": false
}
```

---

### POST /describe
Returns AI-generated description + risk level for an asset.

### POST /recommend
Returns 3 prioritized security recommendations.

### GET /health
Returns model name, uptime, and timestamp.

---

## 🔐 SECURITY FEATURES

| Feature              | Implementation                        |
|----------------------|---------------------------------------|
| Prompt Injection     | Regex detection → 400 blocked         |
| HTML/XSS input       | Stripped before processing            |
| Rate Limiting        | flask-limiter 30 req/min              |
| API Key              | .env only, never committed            |
| AI Failure           | Fallback response (is_fallback: true) |
| Security Headers     | X-Frame, CSP, XSS-Protection          |

---

## ✅ TESTING DONE

- 8 Pytest unit tests (Groq mocked) — ALL PASS
- OWASP ZAP scan — 0 Critical, 0 High remaining
- 10 real inputs tested per endpoint — avg score ≥ 4/5
- Prompt injection tests — ALL BLOCKED correctly

---

## 🔗 GITHUB

Repository: [Link shared by mentor]
AI Service folder: `/ai-service`
Key files:
- `app.py` — Flask entry point
- `services/groq_client.py` — Groq integration
- `services/security_middleware.py` — Input protection
- `routes/generate_report.py` — Main AI feature
- `tests/test_ai_service.py` — 8 unit tests
- `SECURITY.md` — Full security report

---

*AI Developer 2 | Sprint: 14 April – 9 May 2026*

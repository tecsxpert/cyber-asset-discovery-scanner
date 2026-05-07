# Lessons Learned — AI Developer 2
## Tool-95: Cyber Asset Discovery Scanner
## Sprint: 14 April – 9 May 2026

---

## What I Built

As AI Developer 2, I was responsible for:
- Groq API integration (`groq_client.py` with retry + backoff)
- `/generate-report` endpoint — structured JSON security reports
- Security middleware — HTML stripping + prompt injection detection
- Rate limiting — 30 requests/min via flask-limiter
- `AiServiceClient.java` — Java backend ↔ Flask AI connection
- 8 pytest unit tests with Groq mocked
- OWASP ZAP security scan and fixes
- SECURITY.md threat model and sign-off
- Demo script and AI talking points

---

## What Went Well ✅

1. **Fallback design** — Wrapping every Groq call in try/except was the right call. During testing, the Groq free tier hit rate limits. The fallback response meant the system kept running.

2. **Prompt structure** — Forcing JSON output in the prompt template with exact field names made parsing reliable. Without this, responses were inconsistent.

3. **Security middleware as a decorator** — Using `@secure_input` as a Flask decorator kept security logic separate from business logic. Clean and reusable.

4. **Mocking Groq in tests** — Writing all 8 tests with `unittest.mock.patch` meant tests run in under 1 second without any API calls. Good practice.

5. **Security headers** — Adding `@app.after_request` for security headers fixed the OWASP ZAP Critical finding in under 10 minutes.

---

## What Was Difficult ⚠️

1. **Groq response format inconsistency** — Sometimes Groq wrapped JSON in markdown code fences. Had to add stripping logic before `json.loads()`.

2. **Prompt injection regex** — Finding the right patterns without blocking legitimate inputs took more testing than expected. False positives on words like "ignore" in normal sentences.

3. **AiServiceClient.java timeout** — The 10-second timeout was sometimes too short for complex report generation. Worth increasing to 15s in production.

4. **Docker networking** — `localhost` inside a container doesn't reach other containers. Had to use service names (`ai-service:5000`) in docker-compose config.

---

## What I Would Improve 🚀

1. **Async Groq calls** — Currently synchronous. Making them async with Celery or threading would allow the backend to return immediately and poll for results.

2. **Prompt versioning** — Store prompt templates in the database so they can be tuned without redeployment.

3. **AI response caching** — Implement Redis cache with SHA256 key of the input. Identical inputs return cached response in milliseconds.

4. **Better injection detection** — Replace regex with a small classifier model to reduce false positives.

5. **Groq + Ollama hybrid** — Use Groq as primary, fall back to local Ollama when Groq quota is exhausted. Best for production reliability.

6. **Response time logging** — Log every Groq call duration to a metrics store (e.g., Prometheus) for monitoring.

---

## Key Takeaways

- AI integration is not just about calling an API — it's about making it **safe, reliable, and testable**
- Security should be built in from Day 1, not added at the end
- Prompt engineering matters as much as the code around it
- Always test AI with real inputs — scored outputs revealed weaknesses unit tests cannot catch
- Fallback responses are non-negotiable in production AI systems

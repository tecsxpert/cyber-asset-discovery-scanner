# AI Developer 2 — Demo Day Script
# Tool-95: Cyber Asset Discovery Scanner
# Demo Day: Friday 9 May 2026 | Your slot: AI Features (1.5 min)

---

## 🎯 YOUR SEGMENT (After Java Developer 1 finishes CRUD demo)

---

## STEP 1 — AI Recommend (30 seconds)

**[Click "AI Recommend" button on the asset that was just created]**

SAY:
> "Now I'll show you our AI-powered recommendations.
> When a user clicks Recommend, our system sends the asset data
> to our Flask AI microservice, which calls the Groq LLaMA model.
> In under 2 seconds, it returns 3 specific security actions —
> each with a priority level and action type."

**[Wait for results to appear on screen]**

SAY:
> "You can see here — High priority: patch the open SSH port.
> Medium: enable firewall rules. These are generated fresh
> for every asset based on its actual data."

---

## STEP 2 — Generate Report (30 seconds)

**[Click "Generate Report" button]**

SAY:
> "Now Generate Report — this is our main AI feature.
> It sends the full asset profile to Groq and returns
> a structured security report with a title, executive summary,
> key findings, and recommendations."

**[Wait for report to appear]**

SAY:
> "Notice the report is structured — not just free text.
> We designed the prompt to always return the same JSON format,
> so the frontend can render it consistently every time."

---

## STEP 3 — Show /health endpoint (15 seconds)

**[Open browser tab: http://localhost:5000/health]**

SAY:
> "This is our AI service health endpoint.
> It shows the model name, uptime, and timestamp.
> Our Java backend checks this before making any AI call."

---

## STEP 4 — Explain Flask + Groq (15 seconds)

SAY:
> "Quick tech explanation —
> We use Flask as our AI microservice on port 5000.
> It receives requests from the Spring Boot backend,
> sends them to Groq's LLaMA 3.3 70B model via REST API,
> and returns structured JSON.
> If Groq is unavailable, we return a fallback response
> so the system never crashes."

---

## 🛡️ IF ASKED ABOUT SECURITY (Q&A)

**Q: How did you prevent misuse of the AI?**
> "We added input sanitization to strip HTML tags,
> and a regex-based injection detector that blocks
> any input trying to override the AI's instructions.
> Blocked requests return 400 with code INJECTION_DETECTED."

**Q: What if Groq goes down during the demo?**
> "Every Groq call is wrapped in a try-except block.
> On failure, we return a fallback response with is_fallback: true.
> The user sees a message instead of a crash."

**Q: What model are you using?**
> "LLaMA 3.3 70B through Groq's API.
> We set temperature to 0.3 for consistent, factual outputs."

**Q: How do you prevent API key exposure?**
> "The key is stored only in .env which is in .gitignore.
> No key appears in any committed file.
> In production it would be in a secrets manager."

**Q: Did you test the AI?**
> "Yes — we wrote 8 pytest unit tests with Groq mocked,
> ran OWASP ZAP security scan and fixed all Critical findings,
> and tested 10 real inputs per endpoint scoring accuracy above 4 out of 5."

---

## ⚡ QUICK TALKING POINTS (memorize these 5)

1. "We use Groq LLaMA 3.3 70B for AI processing"
2. "We structured prompts to return consistent JSON output"
3. "We block prompt injection with regex detection"
4. "We implemented fallback so the system never returns 500"
5. "We tested AI with real inputs — average score above 4 out of 5"

---

## ⏱️ TIMING GUIDE

| Action | Time |
|--------|------|
| AI Recommend demo | 30 sec |
| Generate Report demo | 30 sec |
| Show /health endpoint | 15 sec |
| Flask + Groq explanation | 15 sec |
| **TOTAL** | **90 sec** ✅ |

---

## ⚠️ BEFORE DEMO — CHECKLIST

- [ ] `docker-compose up` is running
- [ ] http://localhost:5000/health returns `"status": "ok"`
- [ ] GROQ_API_KEY is set in `.env`
- [ ] At least one seeded asset record is visible in the UI
- [ ] Browser tabs pre-opened: App UI + /health endpoint
- [ ] Backup screenshots ready in case of network issue

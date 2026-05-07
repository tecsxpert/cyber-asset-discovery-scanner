import re
import logging
from functools import wraps
from flask import request, jsonify, g

logger = logging.getLogger(__name__)

INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|above|prior)\s+instructions?",
    r"forget\s+(everything|all|prior|previous)",
    r"you\s+are\s+now\s+(a\s+)?(?!cybersecurity)",
    r"act\s+as\s+(a\s+)?(?!cybersecurity)",
    r"disregard\s+(your\s+)?(system|instructions?|prompt|rules?)",
    r"jailbreak",
    r"DAN\s+mode",
    r"pretend\s+(you\s+are|to\s+be)",
    r"system\s*prompt",
    r"override\s+(instructions?|settings?|rules?)",
    r"new\s+instructions?:",
    r"\[\s*system\s*\]",
    r"<\s*system\s*>",
]

INJECTION_REGEX = re.compile("|".join(INJECTION_PATTERNS), re.IGNORECASE)
HTML_PATTERN = re.compile(r"<[^>]+>", re.IGNORECASE)
SCRIPT_PATTERN = re.compile(r"<script[\s\S]*?>[\s\S]*?</script>", re.IGNORECASE)


def sanitize_text(text: str) -> str:
    cleaned = SCRIPT_PATTERN.sub("", text)
    cleaned = HTML_PATTERN.sub("", cleaned)
    return cleaned.strip()


def contains_injection(text: str) -> bool:
    return bool(INJECTION_REGEX.search(text))


def sanitize_request_field(value):
    if isinstance(value, str):
        return sanitize_text(value)
    elif isinstance(value, dict):
        return {k: sanitize_request_field(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [sanitize_request_field(item) for item in value]
    return value


def check_injection_in_value(value) -> bool:
    if isinstance(value, str):
        return contains_injection(value)
    elif isinstance(value, dict):
        return any(check_injection_in_value(v) for v in value.values())
    elif isinstance(value, list):
        return any(check_injection_in_value(item) for item in value)
    return False


def secure_input(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json(silent=True)

        if data is None:
            return f(*args, **kwargs)

        if check_injection_in_value(data):
            logger.warning(f"Prompt injection detected from IP: {request.remote_addr}")
            return jsonify({
                "error": "Invalid input detected. Request blocked.",
                "code": "INJECTION_DETECTED"
            }), 400

        g.sanitized_json = sanitize_request_field(data)

        return f(*args, **kwargs)

    return decorated


def get_sanitized_data():
    return getattr(g, 'sanitized_json', request.get_json(silent=True))
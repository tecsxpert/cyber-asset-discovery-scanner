import json
import logging
import os
from datetime import datetime, timezone

from flask import Blueprint, jsonify
from services.groq_client import call_groq
from services.security_middleware import secure_input, get_sanitized_data

generate_report_bp = Blueprint("generate_report", __name__)
logger = logging.getLogger(__name__)

FALLBACK_RESPONSE = {
    "title": "Security Report (Fallback)",
    "summary": "AI service is temporarily unavailable. Please try again later.",
    "overview": "Unable to generate a full AI report at this time.",
    "key_items": ["Manual review recommended."],
    "recommendations": ["Retry the report generation in a few minutes."],
    "generated_at": None,
    "is_fallback": True
}

PROMPT_TEMPLATE_PATH = os.path.join(
    os.path.dirname(__file__), "..", "prompts", "generate_report_prompt.txt"
)


def load_prompt_template() -> str:
    with open(PROMPT_TEMPLATE_PATH, "r") as f:
        return f.read()


@generate_report_bp.route("/generate-report", methods=["POST"])
@secure_input
def generate_report():
    data = get_sanitized_data()

    if not data or "asset_data" not in data:
        return jsonify({"error": "Missing 'asset_data' in request body"}), 400

    asset_data = data["asset_data"]
    if not isinstance(asset_data, dict) or not asset_data:
        return jsonify({"error": "'asset_data' must be a non-empty JSON object"}), 400

    try:
        prompt_template = load_prompt_template()
        prompt = prompt_template.replace("{{ASSET_DATA}}", json.dumps(asset_data, indent=2))

        raw_response = call_groq(
            prompt=prompt,
            system_message="You are a cybersecurity expert. Always respond in valid JSON only. No extra text.",
            temperature=0.3
        )

        cleaned = raw_response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip()

        report = json.loads(cleaned)

        for field in ["title", "summary", "overview", "key_items", "recommendations"]:
            if field not in report:
                report[field] = "Not available"

        report["generated_at"] = datetime.now(timezone.utc).isoformat()
        report["is_fallback"] = False

        logger.info("Report generated successfully.")
        return jsonify(report), 200

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Groq JSON response: {e}")
        fallback = FALLBACK_RESPONSE.copy()
        fallback["generated_at"] = datetime.now(timezone.utc).isoformat()
        return jsonify(fallback), 200

    except Exception as e:
        logger.error(f"Error in /generate-report: {e}")
        fallback = FALLBACK_RESPONSE.copy()
        fallback["generated_at"] = datetime.now(timezone.utc).isoformat()
        return jsonify(fallback), 200
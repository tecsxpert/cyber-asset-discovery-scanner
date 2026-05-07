<<<<<<< HEAD
from flask import Blueprint, request, jsonify
import os
import json

recommend_bp = Blueprint('recommend', __name__)

@recommend_bp.route('/recommend', methods=['POST'])
def recommend_actions():
    """Get AI recommendations for asset management"""
    try:
        data = request.get_json()
        if not data or 'asset_data' not in data:
            return jsonify({'error': 'asset_data is required'}), 400

        asset_data = data['asset_data']

        # Mock AI recommendations
        recommendations = [
            "Regular security audits recommended",
            "Consider updating to latest firmware",
            "Implement multi-factor authentication",
            "Monitor for unusual network activity"
        ]

        return jsonify({
            'recommendations': recommendations,
            'asset_id': asset_data.get('id'),
            'risk_level': asset_data.get('risk_score', 5)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
=======
import json
import logging
import os
from datetime import datetime, timezone

from flask import Blueprint, jsonify
from services.groq_client import call_groq
from services.security_middleware import secure_input, get_sanitized_data

recommend_bp = Blueprint("recommend", __name__)
logger = logging.getLogger(__name__)

FALLBACK_RESPONSE = {
    "recommendations": [
        {
            "action_type": "MONITOR",
            "description": "AI service is temporarily unavailable. Please perform a manual security review.",
            "priority": "HIGH"
        }
    ],
    "generated_at": None,
    "is_fallback": True
}

PROMPT_TEMPLATE_PATH = os.path.join(
    os.path.dirname(__file__), "..", "prompts", "recommend_prompt.txt"
)


def load_prompt_template() -> str:
    with open(PROMPT_TEMPLATE_PATH, "r") as f:
        return f.read()


@recommend_bp.route("/recommend", methods=["POST"])
@secure_input
def recommend():
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
            temperature=0.4
        )

        cleaned = raw_response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip()

        result = json.loads(cleaned)

        if "recommendations" not in result or not isinstance(result["recommendations"], list):
            raise ValueError("Missing or invalid recommendations array")

        for rec in result["recommendations"]:
            if "action_type" not in rec:
                rec["action_type"] = "MONITOR"
            if "description" not in rec:
                rec["description"] = "Review this asset manually."
            if "priority" not in rec:
                rec["priority"] = "MEDIUM"

        result["generated_at"] = datetime.now(timezone.utc).isoformat()
        result["is_fallback"] = False

        logger.info("Recommend endpoint responded successfully.")
        return jsonify(result), 200

    except (json.JSONDecodeError, ValueError) as e:
        logger.error(f"Failed to parse Groq JSON in /recommend: {e}")
        fallback = FALLBACK_RESPONSE.copy()
        fallback["generated_at"] = datetime.now(timezone.utc).isoformat()
        return jsonify(fallback), 200

    except Exception as e:
        logger.error(f"Error in /recommend: {e}")
        fallback = FALLBACK_RESPONSE.copy()
        fallback["generated_at"] = datetime.now(timezone.utc).isoformat()
        return jsonify(fallback), 200
>>>>>>> bdc09c7 (Integrated ai-service)

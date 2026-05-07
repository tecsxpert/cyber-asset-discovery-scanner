import os
import time
import logging
import requests

logger = logging.getLogger(__name__)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"
MAX_RETRIES = 3
RETRY_DELAY = 2


def call_groq(prompt: str, system_message: str = "You are a cybersecurity expert assistant.", temperature: float = 0.3) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("GROQ_API_KEY is not set in environment variables.")
        raise ValueError("GROQ_API_KEY is missing.")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": GROQ_MODEL,
        "temperature": temperature,
        "max_tokens": 1024,
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]
    }

    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            logger.info(f"Groq API call attempt {attempt}/{MAX_RETRIES}")
            response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=15)
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            logger.info("Groq API call successful.")
            return content

        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error on attempt {attempt}: {e} | Response: {response.text}")
            last_error = e
        except requests.exceptions.ConnectionError as e:
            logger.error(f"Connection error on attempt {attempt}: {e}")
            last_error = e
        except requests.exceptions.Timeout as e:
            logger.error(f"Timeout on attempt {attempt}: {e}")
            last_error = e
        except (KeyError, IndexError) as e:
            logger.error(f"Unexpected response format on attempt {attempt}: {e}")
            last_error = e
        except Exception as e:
            logger.error(f"Unexpected error on attempt {attempt}: {e}")
            last_error = e

        if attempt < MAX_RETRIES:
            logger.info(f"Retrying in {RETRY_DELAY} seconds...")
            time.sleep(RETRY_DELAY * attempt)

    raise Exception(f"Groq API failed after {MAX_RETRIES} attempts. Last error: {last_error}")
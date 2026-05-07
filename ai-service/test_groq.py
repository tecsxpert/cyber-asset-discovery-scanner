"""
test_groq.py — Day 1 verification script
Run: python test_groq.py
Expected: Prints a response from the Groq API.
"""
import os
import sys

# Load .env manually if python-dotenv is not installed
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # .env must be sourced manually if dotenv not installed

from services.groq_client import call_groq


def main():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("ERROR: GROQ_API_KEY not found in environment. Check your .env file.")
        sys.exit(1)

    print(f"API key found: {api_key[:8]}...{api_key[-4:]}")
    print("Sending test request to Groq...\n")

    try:
        response = call_groq(
            prompt="List 3 common cybersecurity threats in one sentence each.",
            temperature=0.3
        )
        print("SUCCESS! Groq response:")
        print("-" * 60)
        print(response)
        print("-" * 60)
        print("\nGroq API is working correctly.")
    except Exception as e:
        print(f"FAILED: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

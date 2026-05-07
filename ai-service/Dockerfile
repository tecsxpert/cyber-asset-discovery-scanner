FROM python:3.11-slim
<<<<<<< HEAD
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
=======

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose AI service port
EXPOSE 5000

# Run the Flask app
>>>>>>> bdc09c7 (Integrated ai-service)
CMD ["python", "app.py"]

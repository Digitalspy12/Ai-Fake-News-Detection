FROM python:3.10-slim

# Create a non-root user (required by Hugging Face Spaces)
RUN useradd -m -u 1000 user

# Set environment variables
ENV PATH="/home/user/.local/bin:$PATH"
ENV PORT=7860

WORKDIR /app

# Install dependencies first (for better caching)
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files
COPY --chown=user . /app

# Switch to the non-root user
USER user

# Expose the port Hugging Face Spaces expects
EXPOSE 7860

# Command to run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

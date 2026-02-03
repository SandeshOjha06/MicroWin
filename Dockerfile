#builder
FROM python:3.11-slim as builder

WORKDIR / app

# install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt


#downloading SpaCy
RUN python -m spacy download en_core_web_sm


#runtime image
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR / app

COPY --from=builder /root/.local /root/.local

ENV PATH=/root/.local/bin:$PATH

#copying SpaCy model from builder
COPY --from=builder /root/anaconda3/lib/python3.11/site-packages /root/.local/lib/python3.11/site-packages

#copy application code
COPY . .


RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

#expose port
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/tasks/health || exit 1


CMD ["python", "main.py"]
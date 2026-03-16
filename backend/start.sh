#!/bin/bash
# Production startup script for Render deployment

set -e

echo "Starting AI Lead Magnet Builder API..."

uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
#!/bin/bash

# GA4 Analytics Dashboard Runner
# This script activates the virtual environment and runs the Streamlit app

echo "🚀 Starting GA4 Analytics Dashboard..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check if HTML dashboard file exists
if [ ! -f "ga4_dashboard.html" ]; then
    echo "❌ Dashboard HTML file not found. Please ensure ga4_dashboard.html exists."
    exit 1
fi

# Activate virtual environment and run the app
source venv/bin/activate
echo "✅ Virtual environment activated"
echo "📊 Launching Streamlit dashboard..."

streamlit run streamlit-ga4-results.py --server.port 8501
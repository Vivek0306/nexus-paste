#!/bin/bash

# Exit immediately if any command fails
set -e

# --- CONFIGURATION ---
FRONTEND_DIR="./frontend"
BACKEND_DIR="./backend"

FRONTEND_CMD="npm run dev"
VIRTUAL_ENV_CMD="source venv/bin/activate"
BACKEND_CMD="python3 run.py"

echo "🚀 Starting development environment..."


echo "📦 Starting Backend..."
cd "$BACKEND_DIR"
$VIRTUAL_ENV_CMD
$BACKEND_CMD &
BACKEND_PID=$!
cd - > /dev/null

echo "🎨 Starting Frontend..."
cd "$FRONTEND_DIR"
$FRONTEND_CMD &
FRONTEND_PID=$!
cd - > /dev/null

cleanup() {
    echo -e "\n🛑 Shutting down services..."
    kill $FRONTEND_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    echo "✨ Done. Both services stopped."
    exit 0
}

trap cleanup SIGINT

echo "🟢 Both services are running. Press [Ctrl+C] to stop both."

# Keep the script alive so it captures Ctrl+C and displays logs
wait

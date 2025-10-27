#!/usr/bin/env python3
"""
Complete project setup script for SMS Marketing Platform
This script sets up both frontend and backend with PostgreSQL
"""

import subprocess
import sys
import os
import time
import requests
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command and return success status"""
    try:
        result = subprocess.run(command, shell=shell, cwd=cwd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {command}")
            return True
        else:
            print(f"❌ {command}")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {command} - Exception: {e}")
        return False

def check_port(port):
    """Check if a port is in use"""
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result == 0

def wait_for_service(url, timeout=30):
    """Wait for a service to be available"""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                return True
        except:
            pass
        time.sleep(1)
    return False

def main():
    print("🚀 SMS Marketing Platform Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("package.json"):
        print("❌ Please run this script from the project root directory")
        return False
    
    # Step 1: Install frontend dependencies
    print("📦 Installing frontend dependencies...")
    if not run_command("npm install"):
        print("❌ Failed to install frontend dependencies")
        return False
    
    # Step 2: Install backend dependencies (if Python is available)
    print("🐍 Checking Python environment...")
    python_available = run_command("python --version")
    
    if python_available:
        print("📦 Installing backend dependencies...")
        if not run_command("pip install -r backend/requirements.txt"):
            print("⚠️  Failed to install backend dependencies - continuing with mock backend")
    
    # Step 3: Check PostgreSQL
    print("🐘 Checking PostgreSQL...")
    postgres_available = check_port(5432)
    
    if postgres_available:
        print("✅ PostgreSQL is running")
        print("📊 Setting up database...")
        if run_command("python backend/setup_database.py"):
            print("✅ Database setup completed")
        else:
            print("⚠️  Database setup failed - will use mock backend")
    else:
        print("⚠️  PostgreSQL not detected - will use mock backend")
    
    # Step 4: Start services
    print("🚀 Starting services...")
    
    # Start mock backend
    print("🔧 Starting mock backend...")
    backend_process = subprocess.Popen(
        ["node", "mock-backend.js"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for backend to start
    if wait_for_service("http://localhost:8000", 10):
        print("✅ Mock backend started successfully")
    else:
        print("❌ Failed to start mock backend")
        return False
    
    # Start frontend
    print("🌐 Starting frontend...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for frontend to start
    if wait_for_service("http://localhost:4000", 30):
        print("✅ Frontend started successfully")
    else:
        print("❌ Failed to start frontend")
        return False
    
    print("=" * 50)
    print("🎉 SMS Marketing Platform is ready!")
    print("")
    print("📱 Frontend: http://localhost:4000")
    print("🔧 Backend: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000")
    print("")
    print("🔑 Login Credentials:")
    print("   Admin: admin@example.com / admin123")
    print("   Client: client1@example.com / password123")
    print("")
    print("📝 To stop the services, press Ctrl+C")
    print("=" * 50)
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Services stopped")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

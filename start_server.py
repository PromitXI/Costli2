"""
Costli Dev Server Launcher
===========================
Starts the Vite development server and opens the app in the default browser.

Usage:
    python start_server.py
"""

import subprocess
import sys
import time
import webbrowser
import socket
import os
import signal

HOST = "localhost"
PORT = 3000
URL = f"http://{HOST}:{PORT}"
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))


def is_port_in_use(port: int, host: str = "localhost") -> bool:
    """Check if a port is already occupied."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1)
        return s.connect_ex((host, port)) == 0


def wait_for_server(port: int, host: str = "localhost", timeout: int = 60) -> bool:
    """Wait until the server starts accepting connections."""
    start = time.time()
    while time.time() - start < timeout:
        if is_port_in_use(port, host):
            return True
        time.sleep(0.5)
    return False


def find_npm() -> str:
    """Locate npm executable (handles Windows .cmd extension)."""
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    return npm_cmd


def main():
    print("=" * 50)
    print("  COSTLI — Dev Server Launcher")
    print("=" * 50)

    # Pre-flight: check if port is already occupied
    if is_port_in_use(PORT, HOST):
        print(f"\n✅ Port {PORT} is already in use.")
        print(f"   Server may already be running at: {URL}")
        print(f"\n🔗 Opening: {URL}")
        webbrowser.open(URL)
        return

    # Ensure we're in the project directory
    os.chdir(PROJECT_DIR)
    print(f"\n📂 Project: {PROJECT_DIR}")
    print(f"🚀 Starting Vite dev server on port {PORT}...\n")

    # Start the dev server as a subprocess
    npm = find_npm()
    try:
        process = subprocess.Popen(
            [npm, "run", "dev"],
            cwd=PROJECT_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
    except FileNotFoundError:
        print("❌ Error: 'npm' not found. Please install Node.js first.")
        print("   Download: https://nodejs.org/")
        sys.exit(1)

    # Wait for the server to be ready
    print("⏳ Waiting for server to start...")
    
    # Stream output while waiting
    server_ready = False
    start_time = time.time()
    timeout = 60  # seconds

    try:
        while True:
            # Check timeout
            if time.time() - start_time > timeout:
                print(f"\n❌ Server did not start within {timeout}s.")
                process.terminate()
                sys.exit(1)

            # Read a line of output (non-blocking via timeout check)
            line = process.stdout.readline()
            if line:
                print(f"   {line.rstrip()}")
                # Vite prints the local URL when ready
                if "Local:" in line or "localhost" in line.lower() or "ready in" in line.lower():
                    server_ready = True

            # Also check the port directly
            if not server_ready and is_port_in_use(PORT, HOST):
                server_ready = True

            if server_ready:
                time.sleep(1)  # Brief pause to let server fully initialize
                break

            # Check if process crashed
            if process.poll() is not None:
                print("\n❌ Server process exited unexpectedly.")
                remaining = process.stdout.read()
                if remaining:
                    print(remaining)
                sys.exit(1)

        # Server is ready — open browser
        print("\n" + "=" * 50)
        print(f"  ✅ Server is LIVE!")
        print(f"  🔗 Local:   {URL}")
        print(f"  🌐 Network: http://0.0.0.0:{PORT}")
        print(f"  📋 Test Link: {URL}")
        print("=" * 50)
        print("\n  Press Ctrl+C to stop the server.\n")

        webbrowser.open(URL)

        # Keep streaming server output until user stops
        while True:
            line = process.stdout.readline()
            if line:
                print(f"   {line.rstrip()}")
            if process.poll() is not None:
                break
            time.sleep(0.1)

    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down server...")
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
        print("   Server stopped. Goodbye!")
        sys.exit(0)


if __name__ == "__main__":
    main()

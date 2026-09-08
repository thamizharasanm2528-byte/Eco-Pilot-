import subprocess
import sys
import os

def main():
    print("===================================================")
    print("   Starting EcoPilot (FastAPI Backend + React UI)  ")
    print("===================================================")
    print("")

    # Command to run concurrently via npm
    try:
        if os.name == 'nt':
            cmd = ["npm.cmd", "run", "start"]
        else:
            cmd = ["npm", "run", "start"]
        
        process = subprocess.Popen(cmd)
        process.wait()
    except KeyboardInterrupt:
        print("\nStopping EcoPilot services...")
        process.terminate()
    except Exception as e:
        print(f"Error starting services: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

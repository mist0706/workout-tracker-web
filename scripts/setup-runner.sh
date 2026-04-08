#!/bin/bash
# GitHub Actions Runner Setup Script
# Run this on 10.7.1.210 after getting the registration token from GitHub UI

set -e

echo "========================================"
echo "GitHub Actions Self-Hosted Runner Setup"
echo "========================================"
echo ""

if [ -z "$1" ]; then
    echo "Usage: ./setup-runner.sh <REGISTRATION_TOKEN>"
    echo ""
    echo "Get your token from:"
    echo "https://github.com/mist0706/workout-tracker-web/settings/actions/runners"
    echo ""
    exit 1
fi

REG_TOKEN=$1

cd ~/actions-runner

# Configure the runner
./config.sh --url https://github.com/mist0706/workout-tracker-web \
  --token $REG_TOKEN \
  --name unas-runner \
  --labels self-hosted,linux,x64,unas \
  --unattended \
  --replace

echo ""
echo "✅ Runner configured!"
echo ""

# Create systemd service file for auto-start
cat > /tmp/github-actions-runner.service <> 'EOF'
[Unit]
Description=GitHub Actions Runner
After=network.target

[Service]
Type=simple
User=mist
WorkingDirectory=/home/mist/actions-runner
ExecStart=/home/mist/actions-runner/run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo mv /tmp/github-actions-runner.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable github-actions-runner

echo "✅ Service created!"
echo ""

# Start the runner
sudo systemctl start github-actions-runner

echo "✅ Runner is starting!"
echo ""
echo "Check status with: sudo systemctl status github-actions-runner"
echo "View logs with: sudo journalctl -u github-actions-runner -f"
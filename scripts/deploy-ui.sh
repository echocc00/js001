#!/bin/bash
# Hydro UI Dark Theme Deployment
# Run on test machine (8.133.200.235) as root

set -e
cd /root/Hydro

echo "=== 1/4 Pulling latest code ==="
git pull origin base-deploy

echo "=== 2/4 Compiling dark theme CSS ==="
node scripts/compile-dark-css.js

echo "=== 3/4 Restarting Hydro ==="
pm2 restart hydro-backend
sleep 2

echo "=== 4/4 Verifying ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/status
echo ""
echo "DONE. Refresh browser to see the new dark theme."

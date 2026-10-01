#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Abrindo o site em http://localhost:4173"
python3 -m http.server 4173

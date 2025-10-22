#!/bin/bash
cd /tmp/kavia/workspace/code-generation/basic-calculator-app-670668-670677/calculator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


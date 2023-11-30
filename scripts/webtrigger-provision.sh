#!/usr/bin/env bash
# Calls the Forge webtrigger to provision initial AWS resources

curl -X POST "$1" \
   -H 'Content-Type: application/json' \
   -d '{"name":"demo-bucket","content":"Hello from the Atlassian Forge AWS SDK Demo"}'

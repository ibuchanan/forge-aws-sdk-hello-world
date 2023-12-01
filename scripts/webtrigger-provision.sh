#!/usr/bin/env bash
# Calls the Forge webtrigger to provision initial AWS resources

FORGE_WEBTRIGGER=$(npm -s run provision:webtrigger)
FORGE_CLIENT_ID=$(npm -s run provision:clientid)

curl --request POST "$FORGE_WEBTRIGGER" \
  --header 'Content-Type: application/json' \
  --data "$FORGE_CLIENT_ID"

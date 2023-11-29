#!/usr/bin/env bash
# Sets Forge variables in the default environment for .env vars

# Match lines that don't start with # (comments) and have a key=value pair
grep '^[^#]\w*=.*' ./.env | while IFS='=' read -r key value; do
    case "$key" in
        FORGE*)
            # Skip vars that start with FORGE
            :;;
        *SECRET*)
            # Encrypt vars that contain SECRET
            echo npm -s run forge:variables:set-encrypted -- "$key" "****"
            npm -s run forge:variables:set-encrypted -- "$key" "$value"
            ;;
        *)
            echo npm -s run forge:variables:set -- "$key" "$value"
            npm run -s forge:variables:set -- "$key" "$value"
            ;;
    esac
done

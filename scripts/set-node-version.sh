#!/usr/bin/env bash
# Sets the current version of node in all the places where a specific version of node is set

node --version > .nvmrc
tmp=$(mktemp) && \
    jq \
        --arg node_version "`node --version | cut -c2-`" \
        '.engines = { "node":$node_version }' \
        package.json \
        > "$tmp" && \
    mv "$tmp" package.json

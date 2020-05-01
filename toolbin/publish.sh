#!/usr/bin/env bash
set -e
MYDIR="$(cd $(dirname "$0") && pwd)"
PROJECTDIR="$(cd "$MYDIR/.." && pwd)"

RELEASEDIR="$PROJECTDIR/.release"
if [ -d "$RELEASEDIR" ]; then
    rm -rf "$RELEASEDIR"
fi
mkdir -p "$RELEASEDIR"
cp -R src index.js package.json package-lock.json readme.md "$RELEASEDIR/"
cd "$RELEASEDIR"
npm pack
npm publish --access public

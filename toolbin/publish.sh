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
V=$(cat "$PROJECTDIR/package.json" | jq -r '.version')
MAJOR="$(echo $V | cut -d '.' -f1)"
MINOR="$(echo $V | cut -d '.' -f2)"
BUILDVER="$MAJOR.$MINOR.$BUILDNUMBER"
cat "$PROJECTDIR/package.json" | jq --arg v "$BUILDVER" '. + {version: $v}' > "$RELEASEDIR/package.json"
cd "$RELEASEDIR"
npm pack
npm publish --access public

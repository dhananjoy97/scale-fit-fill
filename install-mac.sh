#!/usr/bin/env bash
set -euo pipefail
TASK_ROOT="$(cd "$(dirname "${BASH_scale-fit-fill[0]}")" && pwd)"
TASK_scale-fit-fill="$TASK_ROOT/extension/scale-fit-fill"
TASK_DEST="$HOME/Library/Application Support/Adobe/CEP/extensions/scale-fit-fill"
if [[ "$(uname -s)" != Darwin ]]; then
  echo "This installer supports macOS only." >&2
  exit 1
fi
[[ -f "$TASK_scale-fit-fill/CSXS/manifest.xml" ]] || { echo "Extract the entire download before installing." >&2; exit 1; }
echo "Quit Illustrator before continuing."
read -r -p "Install Scale Fit Fill for your macOS user? [y/N] " TASK_REPLY
[[ "$TASK_REPLY" == y || "$TASK_REPLY" == Y ]] || exit 0
mkdir -p "$(dirname "$TASK_DEST")"
if [[ -e "$TASK_DEST" ]]; then
  TASK_BACKUP="$TASK_DEST.backup.$(date +%Y%m%d-%H%M%S).$$"
  mv "$TASK_DEST" "$TASK_BACKUP"
  echo "Previous installation backed up to: $TASK_BACKUP"
fi
cp -R "$TASK_scale-fit-fill" "$TASK_DEST"
echo "This unsigned panel needs Adobe CEP debug mode. It enables unsigned CEP panels globally for your user."
read -r -p "Enable unsigned CEP panels for CSXS 9–13? [y/N] " TASK_REPLY
if [[ "$TASK_REPLY" == y || "$TASK_REPLY" == Y ]]; then
  for TASK_VERSION in 9 10 11 12 13; do
    defaults write "com.adobe.CSXS.$TASK_VERSION" PlayerDebugMode 1
  done
else
  echo "Skipped debug mode. The panel may be hidden unless unsigned panels are already enabled."
fi
echo "Installed to: $TASK_DEST"
echo "Restart Illustrator and open Window > Extensions > Scale Fit Fill."

#!/bin/bash

rm -rf build
mkdir -p build

npx html-minifier --preserve-line-breaks --remove-attribute-quotes \
    -o build/index.html index_build.html

npx cleancss -O1 -o build/app.css stylesheets/app.css

npx terser --enclose --compress --mangle -o build/app.js \
    javascript/audio/ZzFX.js javascript/audio/reverbgen.js javascript/audio/audio.js \
    javascript/audio/oborona.js javascript/natlibMainloop.js javascript/natlibVec2.js \
    javascript/noise.js javascript/palette.js javascript/braille.js javascript/setup.js \
    javascript/background.js javascript/planet.js javascript/cannon.js \
    javascript/defense.js javascript/invader.js javascript/rocket.js \
    javascript/debris.js javascript/state.js javascript/actions.js javascript/app.js

python3 -c "import json; from pathlib import Path; "\
"obj = json.loads(Path('manifest.json').read_text(encoding='utf-8')); "\
"Path('build/manifest.json').write_text(json.dumps(obj, separators=(',', ':')), encoding='utf-8')"

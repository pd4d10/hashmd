#!/bin/sh
dir=$(dirname "$0")
js=${dir}/copy.js
echo $js
node "${js}"

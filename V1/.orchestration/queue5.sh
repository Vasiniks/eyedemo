#!/bin/zsh
cd "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
until grep -q "^EXIT" .orchestration/logs/F4-RAILS.log 2>/dev/null; do sleep 10; done
./.orchestration/run.sh F5-PAUSE .orchestration/prompts/F5-PAUSE.md meta/muse-spark-1.3-contributor /dev/null >/dev/null 2>&1
echo "F5-PAUSE finished: $(grep -E -o '^EXIT [0-9]+' .orchestration/logs/F5-PAUSE.log)"

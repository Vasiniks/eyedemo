#!/bin/zsh
cd "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"; D=.orchestration/prompts; M=opencode/muse-spark-1.3-contributor-free
until grep -q "^EXIT" .orchestration/logs/V2-FILM.log 2>/dev/null; do sleep 15; done
./.orchestration/run.sh V3-PERF $D/V3-PERF.md $M $D/_v3.md >/dev/null 2>&1 &
echo "launched V3-PERF"
sleep 60
until [ $(for V in PERF SCROLL MFILM MPAGE; do grep -l "^EXIT" .orchestration/logs/V3-$V.log 2>/dev/null; done | wc -l) -ge 4 ]; do sleep 20; done
./.orchestration/run.sh V3-QA $D/V3-QA.md $M $D/_v3.md >/dev/null 2>&1
echo "V3-QA finished"

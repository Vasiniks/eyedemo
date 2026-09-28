#!/bin/zsh
cd "/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"; D=.orchestration/prompts
f=0; w=0
while [ $f -eq 0 -o $w -eq 0 ]; do
  if [ $f -eq 0 ] && grep -q "^EXIT" .orchestration/logs/V1-CORE.log; then ./.orchestration/run.sh PX-FILM $D/PX-FILM.md meta/muse-spark-1.3-contributor $D/_polish.md >/dev/null 2>&1 & f=1; echo "launched PX-FILM"; fi
  if [ $w -eq 0 ] && grep -q "^EXIT" .orchestration/logs/V1-WAVES.log; then ./.orchestration/run.sh PX-WAVES $D/PX-WAVES.md meta/muse-spark-1.3-contributor $D/_polish.md >/dev/null 2>&1 & w=1; echo "launched PX-WAVES"; fi
  sleep 10
done
wait

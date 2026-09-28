#!/bin/zsh
# usage: run.sh <ID> <promptfile> [model]
# Model policy: only the two contributor models may ever be used.
ID=$1; PROMPT=$2; MODEL=${3:-meta/muse-spark-1.3-contributor}; HEADER=${4:-.orchestration/prompts/_header.md}
case "$MODEL" in
  opencode/muse-spark-1.3-contributor-free|meta/muse-spark-1.3-contributor) ;;
  *) echo "REFUSED: unauthorized model $MODEL"; exit 9;;
esac
P="/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1"
cd "$P"
opencode run -m "$MODEL" --auto --dir "$P" --title "$ID" "$(cat "$HEADER" "$PROMPT")" > ".orchestration/logs/$ID.log" 2>&1
echo "EXIT $? model=$MODEL" >> ".orchestration/logs/$ID.log"
tail -25 ".orchestration/logs/$ID.log"

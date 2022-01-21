#!/bin/bash
for i in $(seq 1 10); do
  echo "counter i: $i"
  for j in $(seq 1 200); do
    echo "counter j: $j"
    /bin/bash massive-stock-update-test-500.sh
  done
  sleep 1
done

#!/bin/bash
for i in $(seq 1 100); do
  echo "counter i: $i"
  for j in $(seq 1 20); do
    echo "counter j: $j"
    /bin/bash massive-stock-update-test-500.sh
  done
  sleep 1
done

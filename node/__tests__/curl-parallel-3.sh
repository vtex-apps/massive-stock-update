#!/bin/bash
seq 1 2000 | xargs -n1 -P 10 /bin/bash massive-stock-update-test-500.sh

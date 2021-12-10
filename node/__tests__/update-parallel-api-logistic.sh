#!/bin/bash
# Update stock in parallel with api logistic

echo "Script Name: $0"

initialTime=$(date +%s)

/bin/bash api-logistic-inventory-test-1.sh &
/bin/bash api-logistic-inventory-test-1.sh &
/bin/bash api-logistic-inventory-test-1.sh &
/bin/bash api-logistic-inventory-test-1.sh &
/bin/bash api-logistic-inventory-test-1.sh &
wait

finalTime=$(date +%s)
TestTime=$(($finalTime - $initialTime))

echo 'All 5 complete'
echo "Executed in $TestTime seconds"

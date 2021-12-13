#!/bin/bash
# Update inventory by SKU and warehouse

echo "Script Name: $0"

initialTime=$(date +%s)

counter=2

for ((i = 1; i <= $counter; i++)); do
    response=$(curl --location --request PUT 'https://gsalcedo.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/5/warehouses/123' \
        --header 'Content-Type: application/json; charset=utf-8' \
        --header 'VtexIdclientAutCookie: ' \
        --data-raw '{
    "unlimitedQuantity": false,
    "dateUtcOnBalanceSystem": null,
    "quantity": 100
}')
    echo 'Response: ' $response

done

finalTime=$(date +%s)
TestTime=$(($finalTime - $initialTime))

echo
# echo "Executed in $TestTime seconds"

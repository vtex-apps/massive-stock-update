#!/bin/bash
# Update inventory by SKU and warehouse

echo "Script Name: $0"
# read -p "* Insert JWT 'VtexIdclientAutCookie' to Test: " VtexIdclientAutCookie
# read -p "* Insert the number of SKUs to test: " counter

initialTime=$(date +%s)

counter=2

for ((i = 1; i <= $counter; i++)); do
    response=$(curl --location --request PUT 'https://gsalcedo.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/5/warehouses/123' \
        --header 'Content-Type: application/json; charset=utf-8' \
        --header 'VtexIdclientAutCookie: eyJhbGciOiJFUzI1NiIsImtpZCI6IjE3QUY3OERCRTczRDc3QzNFNUFFQjJDNDRGQkY3RUNBMDQ2QzMyQkEiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJ2dGV4YXBwa2V5LWdzYWxjZWRvLUJWRVdWTiIsImFjY291bnQiOiJ2dGV4IiwiYXVkaWVuY2UiOiJhZG1pbiIsImV4cCI6MTYzODg2NzIyOCwidXNlcklkIjoiOWMzZmVlNzItYjI5Ny00ODhjLTkzZGUtMzExYjQyNTZjZTEyIiwiaWF0IjoxNjM4ODQ1NjI4LCJpc3MiOiJ0b2tlbi1lbWl0dGVyIiwianRpIjoiMjFiNzc3M2MtY2Q3MS00YzdhLTg1YzQtNWFkYjg0NDQ3OWIyIn0.0ieB72KPEZQwCqxwtjEHFTAjrLZQGER_RsoneHl9MIo0XxPwsg-i55nQHYymARBUX1YpHusUbKalHiETLLqllQ' \
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

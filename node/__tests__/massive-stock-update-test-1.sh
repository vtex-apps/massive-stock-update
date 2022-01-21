#!/bin/bash
# Massive stock update

echo "Script Name: $0"

initialTime=$(date +%s)

response="$(curl --location --request PUT 'https://tmehdi--gsalcedo.myvtex.com/_v/massive/stock/update' \
  --header 'X-VTEX-API-AppKey: vtexappkey-gsalcedo-BVEWVN' \
  --header 'X-VTEX-API-AppToken: KARRQNTRQBMOMPBNVGZAJMTKINQWEMQWQHGHCEPDIRQHTVIGTTXOEKPYHHJCWWNEKPYFIULQRWSSVLQMFKDKOCSFSIAUUMGLDMXDWDXZIGXIRWCVQWXMTCPHXSNAUQVE' \
  --header 'Content-Type: application/json' \
  --data-raw '[
   {
      "sku":1,
      "warehouseId":123,
      "quantity":15,
      "unlimitedQuantity":false,
      "dateUtcOnBalanceSystem":null
   }
]')"

# echo $response >>"response/file-$initialTime".log
# >>"response/file-$initialTime".log

# txt >>"response/file-$initialTime".log

finalTime=$(date +%s)
TestTime=$(($finalTime - $initialTime))

echo
echo "1 - Executed in $TestTime seconds"

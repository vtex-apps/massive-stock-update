# MASSIVE STOCK UPDATE
Massive inventory stock update service through SKU and warehouseId

##### `PUT `

```https://{environment}--{accountName}.myvtex.com/_v/massive/stock/update```

 
### Headers

- Required
  - Accept : application/json
  - Content-Type : application/json; charset=utf-8

### Path params

- Required
  - sku [int32] 
  - warehouseId [int32] || [string]
  - quantity [int32]
  - unlimitedQuantity [boolean]
  - dateUtcOnBalanceSystem [string]
   
>   Read the API information for more information [link](https://developers.vtex.com/vtex-rest-api/reference/inventory#updateinventorybyskuandwarehouse)

### Request body example

```json
[
   {
      "sku":1,
      "warehouseId":123,
      "quantity":50,
      "unlimitedQuantity":false,
      "dateUtcOnBalanceSystem": null
   }
]
     
```
      
### Success Response body example

```json
{
   "message":[
      {
         "sku":1,
         "success":true,
         "warehouseId":123
      }
   ]
}
```

### Error Response body example

```json
{
    "message": [
        {
            "sku": "3",
            "success": "false",
            "warehouseId": 1236,
            "error": 400,
            "errorMessage": "Warehouse 1236 does not exist!"
        }
    ]
}
```

## Flow

![Massive stock update flow](https://user-images.githubusercontent.com/33711188/126810095-f513cedc-271b-43a4-966a-c7415039507b.png)


## Contributors ✨

Thanks goes to these wonderful people:

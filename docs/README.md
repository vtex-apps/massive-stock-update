# MASSIVE STOCK UPDATE
Massive inventory stock update service through SKU and warehouseId

##### `PUT `

```https://{environment}--{accountName}.myvtex.com/_v/massiveUpdate```

 
### Headers

- Required
  - Accept : application/json
  - Content-Type : application/json; charset=utf-8

### Path params

- Required
  - sku [int32] 
  - warehouseId [int32] || [string]
  - quantity [int32]
  - unlimited [boolean]
   
### Request body example

```json
[
   {
      "sku":1,
      "warehouseId":123,
      "quantity":50,
      "unlimited":true
   },
   {
      "sku":2,
      "warehouseId":123,
      "quantity":10,
      "unlimited":false
   },
   {
      "sku":3,
      "warehouseId":123,
      "quantity":22,
      "unlimited":false
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
      },
      {
         "sku":2,
         "success":true,
         "warehouseId":123
      },
      {
         "sku":3,
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
            "sku": "",
            "warehouseId": "",
            "success": "false",
            "error": "",
            "errorMessage": ""
        }
    ]
}
```

## Flow

![Massive stock update flow](https://user-images.githubusercontent.com/33711188/126810095-f513cedc-271b-43a4-966a-c7415039507b.png)


## Contributors ✨

Thanks goes to these wonderful people:

# API Documentation


Base URL:

Development:

http://localhost:8000


Production:

https://api.domain.com



# Authentication


## Login


POST

/api/auth/login


Request:


{
email:"",
password:""
}



Response:


{
access_token:"",
token_type:"bearer"
}



# Product API


## Get Product List


GET

/api/products



Response:


[
{
id:1,
name:"Product A",
price:10000
}
]



## Create Product


POST

/api/products



# Customer API


GET

/api/customers



# Order API


Create Order


POST

/api/orders



Get Order


GET

/api/orders/{id}



Update Status


PUT

/api/orders/{id}/status



# Mobile API


Authentication

/api/mobile/auth


Product

/api/mobile/products


Order Tracking

/api/mobile/orders
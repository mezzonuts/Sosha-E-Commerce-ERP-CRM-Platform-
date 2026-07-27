# Database Design Document


# Database

Name:

commerce_db


Engine:

PostgreSQL



# Main Entity


## users

Purpose:

Authentication user


Fields:

id

email

password_hash

role

created_at



## customers


id

user_id

name

phone

address

created_at



## products


id

sku

name

category_id

price

stock

weight

image

status



## categories


id

name



## inventory


id

product_id

quantity

warehouse_id



## orders


id

customer_id

order_date

status

total_amount



## order_items


id

order_id

product_id

qty

price



## payments


id

order_id

payment_method

status



## shipments


id

order_id

courier

tracking_number

status



## crm_activity


id

customer_id

activity_type

notes

created_at



## marketplace_sync


id

marketplace

product_id

sync_status



# Relationship


User

1 ---- 1

Customer


Customer

1 ---- *

Order


Order

1 ---- *

Order Item


Product

1 ---- *

Order Item
# System Architecture Document


# 1. Architecture Overview


System menggunakan:

Frontend:
- Next.js
- Flutter


Backend:
- FastAPI


Database:
- PostgreSQL


Infrastructure:
- Docker



# 2. High Level Architecture


Customer

|
|

Web Application
Next.js


Mobile Application
Flutter


|
|

API Gateway

|
|

FastAPI Backend


|
|-----------------
|
PostgreSQL Database

Redis Cache

File Storage



# 3. Backend Architecture


FastAPI

|

Modules:


Authentication

Product

Customer

Order

Payment

Inventory

CRM

Reporting



# 4. Integration Architecture


External Services:


Marketplace:

- Shopee API
- Tokopedia API


Communication:

- WhatsApp API


Shipping:

- JNE
- J&T
- SiCepat


Payment:

- Payment Gateway



# 5. Deployment Architecture


Production:


Nginx

|

Frontend Container

|

Backend Container

|

PostgreSQL Container

|

Redis Container



# 6. CI/CD Flow


Developer

|

GitHub

|

GitHub Actions

|

Docker Build

|

Production Server
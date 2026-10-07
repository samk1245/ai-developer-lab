# Multi-Tenant E-Commerce API

## Base URL
http://localhost:5000

## Health
GET /api/health
Checks API and MongoDB connectivity.

## Tenants
/api/tenants
Tenant management endpoints.

## Authentication
/api/auth
JWT authentication endpoints.

## Products
/api/products
Tenant-aware product endpoints.

## Cart
/api/cart
Shopping cart endpoints.

## Orders
/api/orders
Order management endpoints.

## Multi-Tenancy
Tenant-aware requests use tenantId to separate store data.

## Security
- Helmet HTTP security headers
- Morgan request logging
- CORS middleware
- JWT authentication
- Environment variables for configuration

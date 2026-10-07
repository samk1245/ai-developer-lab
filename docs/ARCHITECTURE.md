# Project Architecture

## Overview
Multi-tenant e-commerce application with React/Vite frontend and Express/MongoDB backend.

## Backend Layers
- config
- controllers
- middleware
- models
- routes
- database connection

## Frontend
React + Vite application communicating with the REST API.

## Request Flow
React Frontend -> Express REST API -> Authentication/Tenant Logic -> MongoDB

## Core Modules
- Tenant management
- Authentication
- Products
- Cart
- Orders

## Security
Helmet, Morgan, CORS and JWT-based authentication are used in the API.

## Tenant Isolation
Resources are associated with a tenant so stores can operate independently.

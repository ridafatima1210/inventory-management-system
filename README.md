# Inventory & Order Management System

A full-stack Inventory & Order Management System built with FastAPI, React, PostgreSQL, Docker, and modern deployment platforms. The application enables businesses to manage products, customers, and orders while maintaining accurate inventory levels through automated stock updates.

## Live Demo

### Frontend
https://inventory-management-system-two-self.vercel.app

### Backend API
https://inventory-backend-tm1t.onrender.com

### API Documentation
https://inventory-backend-tm1t.onrender.com/openapi.json

### GitHub Repository
https://github.com/ridafatima1210/inventory-management-system

---

## Features

### Dashboard Analytics
- Total products count
- Total customers count
- Total orders count
- Low stock monitoring
- Real-time statistics

### Product Management
- Create products
- View all products
- Update product details
- Delete products
- Unique SKU validation

### Customer Management
- Create customers
- View customer records
- Delete customers
- Email uniqueness validation

### Order Processing
- Create orders
- Inventory validation
- Automatic stock deduction
- Order history tracking
- Order cancellation with stock restoration

### Business Logic
- Prevents orders exceeding available stock
- Automatically calculates order totals
- Maintains inventory consistency
- Enforces data validation rules

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database
- PostgreSQL

### DevOps & Deployment
- Docker
- Docker Compose
- Render (Backend)
- Vercel (Frontend)
- GitHub

---

## Project Structure

```bash
inventory-management-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── __init__.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Customers.jsx
│   │   │   └── Orders.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

### Dashboard

| Method | Endpoint |
|----------|-----------|
| GET | /api/dashboard |

### Products

| Method | Endpoint |
|----------|-----------|
| GET | /api/products |
| POST | /api/products |
| GET | /api/products/{id} |
| PUT | /api/products/{id} |
| DELETE | /api/products/{id} |

### Customers

| Method | Endpoint |
|----------|-----------|
| GET | /api/customers |
| POST | /api/customers |
| GET | /api/customers/{id} |
| DELETE | /api/customers/{id} |

### Orders

| Method | Endpoint |
|----------|-----------|
| GET | /api/orders |
| POST | /api/orders |
| GET | /api/orders/{id} |
| DELETE | /api/orders/{id} |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/ridafatima1210/inventory-management-system.git
cd inventory-management-system
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows:
# venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=postgresql://username:password@host:5432/database
```

### Frontend

```env
VITE_API_URL=https://inventory-backend-tm1t.onrender.com/api
```

---

## Docker Deployment

Run the complete application using Docker:

```bash
docker-compose up --build
```

---

## Screenshots

### Dashboard
- Inventory statistics
- Customer metrics
- Order tracking

### Products
- Product creation
- Product inventory management

### Customers
- Customer registration
- Customer records management

### Orders
- Order placement
- Inventory updates

---

## Key Business Rules

### Inventory Validation

Orders cannot exceed available stock:

```python
if product.quantity < order.quantity:
    raise HTTPException(
        status_code=400,
        detail="Insufficient inventory"
    )
```

### Automatic Stock Management

When an order is placed:

```python
product.quantity -= order.quantity
```

When an order is deleted:

```python
product.quantity += order.quantity
```

---

## Deployment

### Backend
- Render

### Frontend
- Vercel

### Database
- PostgreSQL

---

## Author

**Rida Fatima**

GitHub:
https://github.com/ridafatima1210

---

## License

This project was developed for educational and portfolio purposes.

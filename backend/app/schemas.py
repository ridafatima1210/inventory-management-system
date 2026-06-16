from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

# Product Schemas
class ProductBase(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

# Customer Schemas
class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    class Config:
        from_attributes = True

# Order Schemas
class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int = Field(gt=0)

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    total_amount: float
    created_at: datetime
    customer: CustomerResponse
    product: ProductResponse
    class Config:
        from_attributes = True

# Dashboard Schema
class DashboardStats(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_count: int
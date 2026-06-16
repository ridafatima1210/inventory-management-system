from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from .database import engine, Base, get_db
from . import models, schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/dashboard", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(models.Product).count()
    total_customers = db.query(models.Customer).count()
    total_orders = db.query(models.Order).count()
    low_stock_count = db.query(models.Product).filter(models.Product.quantity < 10).count()
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_count": low_stock_count
    }

@app.post("/api/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    if db.query(models.Product).filter(models.Product.sku == product.sku).first():
        raise HTTPException(status_code=400, detail="SKU code must be unique")
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/api/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.get("/api/products/{id}", response_model=schemas.ProductResponse)
def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/api/products/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, updated_product: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    sku_check = db.query(models.Product).filter(models.Product.sku == updated_product.sku, models.Product.id != id).first()
    if sku_check:
        raise HTTPException(status_code=400, detail="SKU code already in use by another product")

    for key, value in updated_product.model_dump().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@app.delete("/api/products/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return None

# --- CUSTOMER APIs ---
@app.post("/api/customers", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    if db.query(models.Customer).filter(models.Customer.email == customer.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/api/customers", response_model=List[schemas.CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

@app.get("/api/customers/{id}", response_model=schemas.CustomerResponse)
def get_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.delete("/api/customers/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return None

# --- ORDER APIs ---
@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == order.product_id).first()
    customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer reference not found")
    if not product:
        raise HTTPException(status_code=404, detail="Product reference not found")
    if product.quantity < order.quantity:
        raise HTTPException(status_code=400, detail=f"Insufficient inventory. Only {product.quantity} units left.")

    # Process Business Logic rules
    product.quantity -= order.quantity
    total_amount = round(product.price * order.quantity, 2)

    db_order = models.Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity,
        total_amount=total_amount
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/api/orders", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()

@app.get("/api/orders/{id}", response_model=schemas.OrderResponse)
def get_order(id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.delete("/api/orders/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Return inventory back on order cancellation
    product = db.query(models.Product).filter(models.Product.id == order.product_id).first()
    if product:
        product.quantity += order.quantity

    db.delete(order)
    db.commit()
    return None
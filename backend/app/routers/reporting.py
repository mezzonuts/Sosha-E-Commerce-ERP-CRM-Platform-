from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Dict, Any
from app.database.session import get_db
from app.models.user import Order, OrderItem, Product, Customer, Payment, Shipment, OrderStatus, PaymentStatus

router = APIRouter(prefix="/api/reporting", tags=["reporting"])

@router.get("/sales")
def get_sales_report(period: str = "month", db: Session = Depends(get_db)) -> Dict[str, Any]:
    now = datetime.utcnow()
    if period == "day":
        start_date = now - timedelta(days=1)
    elif period == "week":
        start_date = now - timedelta(weeks=1)
    elif period == "month":
        start_date = now - timedelta(days=30)
    elif period == "year":
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=30)

    total_orders = db.query(func.count(Order.id)).filter(Order.order_date >= start_date).scalar() or 0
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.order_date >= start_date).scalar() or 0.0
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0.0

    return {
        "period": period,
        "start_date": start_date.isoformat(),
        "end_date": now.isoformat(),
        "total_orders": total_orders,
        "total_revenue": round(total_revenue, 2),
        "avg_order_value": round(avg_order_value, 2),
    }

@router.get("/products")
def get_product_report(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_products = db.query(func.count(Product.id)).scalar() or 0
    active_products = db.query(func.count(Product.id)).filter(Product.status == "active").scalar() or 0
    low_stock = db.query(func.count(Product.id)).filter(Product.stock < 10).scalar() or 0

    return {
        "total_products": total_products,
        "active_products": active_products,
        "low_stock_products": low_stock,
    }

@router.get("/customers")
def get_customer_report(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    new_customers = db.query(func.count(Customer.id)).filter(
        Customer.created_at >= datetime.utcnow() - timedelta(days=30)
    ).scalar() or 0

    return {
        "total_customers": total_customers,
        "new_customers_last_30_days": new_customers,
    }

@router.get("/orders")
def get_order_report(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    pending_orders = db.query(func.count(Order.id)).filter(Order.status == OrderStatus.PENDING).scalar() or 0
    processing_orders = db.query(func.count(Order.id)).filter(Order.status == OrderStatus.PROCESSING).scalar() or 0
    shipped_orders = db.query(func.count(Order.id)).filter(Order.status == OrderStatus.SHIPPED).scalar() or 0
    delivered_orders = db.query(func.count(Order.id)).filter(Order.status == OrderStatus.DELIVERED).scalar() or 0
    cancelled_orders = db.query(func.count(Order.id)).filter(Order.status == OrderStatus.CANCELLED).scalar() or 0

    return {
        "total_orders": total_orders,
        "pending": pending_orders,
        "processing": processing_orders,
        "shipped": shipped_orders,
        "delivered": delivered_orders,
        "cancelled": cancelled_orders,
    }

@router.get("/payments")
def get_payment_report(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_payments = db.query(func.count(Payment.id)).scalar() or 0
    paid_payments = db.query(func.count(Payment.id)).filter(Payment.status == PaymentStatus.PAID).scalar() or 0
    pending_payments = db.query(func.count(Payment.id)).filter(Payment.status == PaymentStatus.PENDING).scalar() or 0
    failed_payments = db.query(func.count(Payment.id)).filter(Payment.status == PaymentStatus.FAILED).scalar() or 0

    return {
        "total_payments": total_payments,
        "paid": paid_payments,
        "pending": pending_payments,
        "failed": failed_payments,
    }

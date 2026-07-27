from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Order, OrderItem, Product
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdateStatus
from app.dependencies import get_current_user
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_order = Order(customer_id=order.customer_id)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    total_amount = 0.0
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        db_item = OrderItem(order_id=db_order.id, product_id=item.product_id, qty=item.qty, price=item.price)
        db.add(db_item)
        total_amount += item.qty * item.price

    db_order.total_amount = total_amount
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/", response_model=PaginatedResponse[OrderResponse])
def get_orders(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    total = db.query(Order).count()
    orders = db.query(Order).offset(skip).limit(limit).all()
    return PaginatedResponse(data=orders, total=total, skip=skip, limit=limit, has_more=skip + limit < total)

@router.put("/{order_id}/status")
def update_order_status(order_id: int, status_data: OrderUpdateStatus, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status_data.status
    db.commit()
    return {"message": "Order status updated", "order_id": order_id, "status": status_data.status}

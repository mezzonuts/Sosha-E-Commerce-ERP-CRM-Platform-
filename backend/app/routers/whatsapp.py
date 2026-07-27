from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import Order, Customer
from app.services.whatsapp import WhatsAppService

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

@router.post("/send/{order_id}")
def send_whatsapp_notification(order_id: int, request: dict, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    notification_type = request.get("type", "order_created")
    phone = customer.phone or "+1234567890"
    
    if notification_type == "order_created":
        result = WhatsAppService.send_order_notification(
            customer.name, order.id, order.total_amount, phone
        )
    elif notification_type == "payment":
        result = WhatsAppService.send_payment_notification(
            customer.name, order.id, "paid", phone
        )
    elif notification_type == "shipment":
        result = WhatsAppService.send_shipment_notification(
            customer.name, order.id, "TRACK123", "JNE", phone
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid notification type")
    
    return {"message": "Notification sent", "result": result}

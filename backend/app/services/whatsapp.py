class WhatsAppService:
    @staticmethod
    def send_message(phone_number: str, message: str) -> dict:
        return {
            "status": "success",
            "message": "WhatsApp message sent (mock)",
            "phone": phone_number,
            "content": message,
        }

    @staticmethod
    def send_order_notification(customer_name: str, order_id: int, total: float, phone: str) -> dict:
        message = f"Hello {customer_name}, your order #{order_id} has been placed successfully. Total: Rp {total:,.0f}. Thank you for shopping with us!"
        return WhatsAppService.send_message(phone, message)

    @staticmethod
    def send_payment_notification(customer_name: str, order_id: int, status: str, phone: str) -> dict:
        message = f"Hello {customer_name}, payment for order #{order_id} is {status}."
        return WhatsAppService.send_message(phone, message)

    @staticmethod
    def send_shipment_notification(customer_name: str, order_id: int, tracking_number: str, courier: str, phone: str) -> dict:
        message = f"Hello {customer_name}, your order #{order_id} has been shipped via {courier}. Tracking number: {tracking_number}."
        return WhatsAppService.send_message(phone, message)

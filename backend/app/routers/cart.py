from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.database.session import get_db
from app.models.user import Cart, CartItem, Customer, Product
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse
from app.dependencies import get_current_user
from app.core.pagination import PaginatedResponse

router = APIRouter(prefix="/api/cart", tags=["cart"])

def get_or_create_cart(db: Session, customer_id: int) -> Cart:
    cart = db.query(Cart).filter(Cart.customer_id == customer_id).first()
    if not cart:
        cart = Cart(customer_id=customer_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

@router.get("/", response_model=CartResponse)
def get_cart(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    cart = db.query(Cart).options(joinedload(Cart.items).joinedload(CartItem.product)).filter(Cart.customer_id == customer.id).first()
    if not cart:
        cart = Cart(customer_id=customer.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

@router.post("/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_cart_item(item: CartItemCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    cart = get_or_create_cart(db, customer.id)
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < item.qty:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    existing = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == item.product_id).first()
    if existing:
        existing.qty += item.qty
        db.commit()
        db.refresh(existing)
        return existing
    db_item = CartItem(cart_id=cart.id, product_id=item.product_id, qty=item.qty, price=product.price)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/items/{item_id}", response_model=CartItemResponse)
def update_cart_item(item_id: int, item_update: CartItemUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    cart = get_or_create_cart(db, customer.id)
    db_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    product = db.query(Product).filter(Product.id == db_item.product_id).first()
    if product.stock < item_update.qty:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    db_item.qty = item_update.qty
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cart_item(item_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    cart = get_or_create_cart(db, customer.id)
    db_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(db_item)
    db.commit()
    return None

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    cart = get_or_create_cart(db, customer.id)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    return None

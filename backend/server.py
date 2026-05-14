from fastapi import FastAPI, APIRouter, HTTPException, Depends, Body
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'vincode_db')]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'vincode-secret-key-2024')
JWT_ALGORITHM = 'HS256'

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class OrderCreate(BaseModel):
    vin: str
    car_model: str
    name: str
    phone: str
    email: Optional[str] = None
    telegram: Optional[str] = None
    delivery_method: str = "email"  # email or telegram

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    result_text: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class SettingsUpdate(BaseModel):
    price_azn: Optional[float] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    primary_color: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None

class TrackingRequest(BaseModel):
    tracking_code: str

# ==================== HELPERS ====================

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == '_id':
            result['id'] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        else:
            result[key] = value
    return result

def generate_tracking_code():
    """Generate a unique tracking code"""
    return f"VIN-{secrets.token_hex(4).upper()}"

async def get_settings():
    """Get or create default settings"""
    settings = await db.settings.find_one({"type": "site_settings"})
    if not settings:
        default_settings = {
            "type": "site_settings",
            "price_azn": 15.0,
            "hero_title": "AVTOVIN YOXLAMA",
            "hero_subtitle": "VIN kodunu daxil edin, 15 AZN \u00f6d\u0259ni\u015f edin v\u0259 hesabat\u0131 \u0259ld\u0259 edin.",
            "primary_color": "#F5C84B",
            "logo_url": "",
            "banner_url": "",
            "telegram_bot_token": "",
            "telegram_chat_id": "",
            "smtp_host": "",
            "smtp_port": 587,
            "smtp_user": "",
            "smtp_password": ""
        }
        await db.settings.insert_one(default_settings)
        settings = default_settings
    return serialize_doc(settings)

async def verify_admin_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== INIT ====================

async def init_admin():
    """Initialize default admin user if not exists"""
    admin = await db.admins.find_one({"username": "admin"})
    if not admin:
        hashed = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
        await db.admins.insert_one({
            "username": "admin",
            "password": hashed.decode('utf-8'),
            "created_at": datetime.now(timezone.utc)
        })
        logger.info("Default admin user created")

@app.on_event("startup")
async def startup():
    await init_admin()
    await get_settings()
    logger.info("VINCODE backend started")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "VINCODE API"}

@api_router.get("/settings/public")
async def get_public_settings():
    """Get public-facing settings (price, texts, design)"""
    settings = await get_settings()
    return {
        "price_azn": settings.get("price_azn", 15.0),
        "hero_title": settings.get("hero_title", "AVTOVIN YOXLAMA"),
        "hero_subtitle": settings.get("hero_subtitle", ""),
        "primary_color": settings.get("primary_color", "#F5C84B"),
        "logo_url": settings.get("logo_url", ""),
        "banner_url": settings.get("banner_url", "")
    }

@api_router.post("/orders")
async def create_order(order: OrderCreate):
    """Create a new VIN check order"""
    # Validate VIN (17 characters)
    if len(order.vin) != 17:
        raise HTTPException(status_code=400, detail="VIN kodu 17 simvol olmal\u0131d\u0131r")
    
    # Validate delivery method has contact
    if order.delivery_method == "email" and not order.email:
        raise HTTPException(status_code=400, detail="Email daxil edin")
    if order.delivery_method == "telegram" and not order.telegram:
        raise HTTPException(status_code=400, detail="Telegram username daxil edin")
    
    settings = await get_settings()
    tracking_code = generate_tracking_code()
    
    order_doc = {
        "order_id": str(uuid.uuid4()),
        "tracking_code": tracking_code,
        "vin": order.vin.upper(),
        "car_model": order.car_model,
        "name": order.name,
        "phone": order.phone,
        "email": order.email,
        "telegram": order.telegram,
        "delivery_method": order.delivery_method,
        "price_azn": settings.get("price_azn", 15.0),
        "payment_status": "pending",
        "status": "g\u00f6zl\u0259yir",
        "result_text": "",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "sent_at": None
    }
    
    await db.orders.insert_one(order_doc)
    
    return {
        "order_id": order_doc["order_id"],
        "tracking_code": tracking_code,
        "price_azn": order_doc["price_azn"],
        "message": "Sifari\u015f yarad\u0131ld\u0131. \u00d6d\u0259ni\u015f etm\u0259k laz\u0131md\u0131r."
    }

@api_router.post("/orders/{order_id}/pay")
async def mock_payment(order_id: str):
    """Mock PayPal payment - simulates successful payment"""
    order = await db.orders.find_one({"order_id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Sifari\u015f tap\u0131lmad\u0131")
    
    if order["payment_status"] == "paid":
        raise HTTPException(status_code=400, detail="\u00d6d\u0259ni\u015f art\u0131q edilib")
    
    # Simulate successful payment
    await db.orders.update_one(
        {"order_id": order_id},
        {
            "$set": {
                "payment_status": "paid",
                "status": "g\u00f6zl\u0259yir",
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    # Log notification (would send Telegram in production)
    logger.info(f"NEW ORDER PAID: VIN={order['vin']}, Customer={order['name']}, Contact={order.get('email') or order.get('telegram')}")
    
    # Try to send Telegram notification
    await send_admin_telegram_notification(order)
    
    return {
        "status": "success",
        "message": "\u00d6d\u0259ni\u015f u\u011furlu oldu! Sifari\u015finiz q\u0259bul edildi.",
        "tracking_code": order["tracking_code"]
    }

@api_router.post("/orders/track")
async def track_order(req: TrackingRequest):
    """Track order by tracking code"""
    order = await db.orders.find_one({"tracking_code": req.tracking_code.upper().strip()})
    if not order:
        raise HTTPException(status_code=404, detail="Sifari\u015f tap\u0131lmad\u0131. Tracking kodu yoxlay\u0131n.")
    
    return {
        "tracking_code": order["tracking_code"],
        "vin": order["vin"],
        "car_model": order["car_model"],
        "status": order["status"],
        "payment_status": order["payment_status"],
        "created_at": order["created_at"].isoformat() if isinstance(order["created_at"], datetime) else order["created_at"],
        "result_text": order.get("result_text", "") if order["status"] == "g\u00f6nd\u0259rildi" else ""
    }

# ==================== ADMIN ROUTES ====================

@api_router.post("/admin/login")
async def admin_login(creds: AdminLogin):
    """Admin login"""
    admin = await db.admins.find_one({"username": creds.username})
    if not admin:
        raise HTTPException(status_code=401, detail="Yanl\u0131\u015f istifad\u0259\u00e7i ad\u0131 v\u0259 ya \u015fifr\u0259")
    
    if not bcrypt.checkpw(creds.password.encode('utf-8'), admin['password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Yanl\u0131\u015f istifad\u0259\u00e7i ad\u0131 v\u0259 ya \u015fifr\u0259")
    
    token = jwt.encode(
        {
            "username": admin["username"],
            "exp": datetime.now(timezone.utc).timestamp() + 86400  # 24 hours
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )
    
    return {"token": token, "username": admin["username"]}

@api_router.get("/admin/orders")
async def get_admin_orders(token: str = "", status: str = "", search: str = "", payment: str = ""):
    """Get all orders for admin with search and filters"""
    await verify_admin_token(token)
    
    query = {}
    if status:
        query["status"] = status
    if payment:
        query["payment_status"] = payment
    
    # Search by VIN, name, email, telegram, tracking code
    if search:
        search_upper = search.upper()
        query["$or"] = [
            {"vin": {"$regex": search_upper, "$options": "i"}},
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"telegram": {"$regex": search, "$options": "i"}},
            {"tracking_code": {"$regex": search_upper, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
    
    orders = await db.orders.find(query).sort("created_at", -1).to_list(500)
    return [serialize_doc(o) for o in orders]

@api_router.get("/admin/orders/{order_id}")
async def get_admin_order(order_id: str, token: str = ""):
    """Get single order detail"""
    await verify_admin_token(token)
    
    order = await db.orders.find_one({"order_id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Sifari\u015f tap\u0131lmad\u0131")
    
    return serialize_doc(order)

@api_router.put("/admin/orders/{order_id}")
async def update_admin_order(order_id: str, update: OrderUpdate, token: str = ""):
    """Update order status or result"""
    await verify_admin_token(token)
    
    order = await db.orders.find_one({"order_id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Sifari\u015f tap\u0131lmad\u0131")
    
    update_data = {"updated_at": datetime.now(timezone.utc)}
    
    if update.status:
        update_data["status"] = update.status
    if update.result_text is not None:
        update_data["result_text"] = update.result_text
    
    await db.orders.update_one({"order_id": order_id}, {"$set": update_data})
    
    updated_order = await db.orders.find_one({"order_id": order_id})
    return serialize_doc(updated_order)

@api_router.post("/admin/orders/{order_id}/send")
async def send_order_result(order_id: str, token: str = ""):
    """Send VIN result to customer via email or telegram"""
    await verify_admin_token(token)
    
    order = await db.orders.find_one({"order_id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Sifari\u015f tap\u0131lmad\u0131")
    
    if not order.get("result_text"):
        raise HTTPException(status_code=400, detail="\u018evv\u0259lc\u0259 n\u0259tic\u0259 m\u0259tni \u0259lav\u0259 edin")
    
    # Try sending based on delivery method
    sent = False
    delivery_method = order.get("delivery_method", "email")
    
    if delivery_method == "telegram" and order.get("telegram"):
        sent = await send_customer_telegram(order)
    elif delivery_method == "email" and order.get("email"):
        sent = await send_customer_email(order)
    
    # Update status
    await db.orders.update_one(
        {"order_id": order_id},
        {
            "$set": {
                "status": "g\u00f6nd\u0259rildi",
                "sent_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    if sent:
        return {"message": "N\u0259tic\u0259 m\u00fcv\u0259ff\u0259qiyy\u0259tl\u0259 g\u00f6nd\u0259rildi", "sent": True}
    else:
        return {"message": "N\u0259tic\u0259 g\u00f6nd\u0259rildi olaraq qeyd edildi (bildiri\u015f konfiqurasiya edilm\u0259yib)", "sent": False}

@api_router.delete("/admin/orders/{order_id}")
async def delete_order(order_id: str, token: str = ""):
    """Delete an order"""
    await verify_admin_token(token)
    
    result = await db.orders.delete_one({"order_id": order_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sifari\u015f tap\u0131lmad\u0131")
    
    return {"message": "Sifari\u015f silindi"}

@api_router.get("/admin/stats")
async def get_admin_stats(token: str = ""):
    """Get dashboard statistics"""
    await verify_admin_token(token)
    
    total_orders = await db.orders.count_documents({})
    paid_orders = await db.orders.count_documents({"payment_status": "paid"})
    waiting_orders = await db.orders.count_documents({"status": "g\u00f6zl\u0259yir", "payment_status": "paid"})
    checking_orders = await db.orders.count_documents({"status": "yoxlan\u0131l\u0131r"})
    sent_orders = await db.orders.count_documents({"status": "g\u00f6nd\u0259rildi"})
    
    # Calculate revenue
    pipeline = [
        {"$match": {"payment_status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$price_azn"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return {
        "total_orders": total_orders,
        "paid_orders": paid_orders,
        "waiting_orders": waiting_orders,
        "checking_orders": checking_orders,
        "sent_orders": sent_orders,
        "total_revenue": total_revenue
    }

@api_router.get("/admin/customers")
async def get_admin_customers(token: str = "", search: str = ""):
    """Get customer list with search"""
    await verify_admin_token(token)
    
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
            {"telegram": {"$regex": search, "$options": "i"}}
        ]
    
    orders = await db.orders.find(query, {"_id": 0, "name": 1, "phone": 1, "email": 1, "telegram": 1, "created_at": 1}).sort("created_at", -1).to_list(500)
    
    # Deduplicate by email/phone
    seen = set()
    customers = []
    for o in orders:
        key = o.get("email") or o.get("phone") or o.get("telegram")
        if key and key not in seen:
            seen.add(key)
            order_count = 0
            # Count orders for this customer
            customers.append({
                "name": o.get("name", ""),
                "phone": o.get("phone", ""),
                "email": o.get("email", ""),
                "telegram": o.get("telegram", ""),
                "created_at": o["created_at"].isoformat() if isinstance(o.get("created_at"), datetime) else str(o.get("created_at", ""))
            })
    
    return customers

@api_router.get("/admin/payments")
async def get_admin_payments(token: str = ""):
    """Get payments list"""
    await verify_admin_token(token)
    
    orders = await db.orders.find(
        {"payment_status": "paid"},
        {"_id": 0, "order_id": 1, "name": 1, "vin": 1, "price_azn": 1, "payment_status": 1, "created_at": 1, "tracking_code": 1}
    ).sort("created_at", -1).to_list(500)
    
    return [{
        **o,
        "created_at": o["created_at"].isoformat() if isinstance(o.get("created_at"), datetime) else str(o.get("created_at", ""))
    } for o in orders]

@api_router.get("/admin/settings")
async def get_admin_settings(token: str = ""):
    """Get all settings"""
    await verify_admin_token(token)
    return await get_settings()

@api_router.put("/admin/settings")
async def update_settings(update: SettingsUpdate, token: str = ""):
    """Update site settings"""
    await verify_admin_token(token)
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if update_data:
        await db.settings.update_one(
            {"type": "site_settings"},
            {"$set": update_data}
        )
    
    return await get_settings()

# ==================== NOTIFICATION SERVICES ====================

async def send_admin_telegram_notification(order):
    """Send notification to admin via Telegram"""
    settings = await get_settings()
    bot_token = settings.get("telegram_bot_token", "")
    chat_id = settings.get("telegram_chat_id", "")
    
    if not bot_token or not chat_id:
        logger.info("Telegram not configured, skipping admin notification")
        return False
    
    try:
        import httpx
        contact = order.get('email') or order.get('telegram') or order.get('phone')
        delivery = "Email" if order.get('delivery_method') == 'email' else "Telegram"
        message = (
            f"\U0001f697 <b>Yeni VIN sifarişi gəldi!</b>\n\n"
            f"<b>VIN:</b> <code>{order['vin']}</code>\n"
            f"<b>Avtomobil:</b> {order.get('car_model', '-')}\n"
            f"<b>Müştəri:</b> {order['name']}\n"
            f"<b>Telefon:</b> {order.get('phone', '-')}\n"
            f"<b>Əlaqə:</b> {contact}\n"
            f"<b>Çatdırılma:</b> {delivery}\n"
            f"<b>Qiymət:</b> {order.get('price_azn', 15)} AZN\n"
            f"<b>Tracking:</b> <code>{order.get('tracking_code', '-')}</code>"
        )
        
        async with httpx.AsyncClient() as http_client:
            resp = await http_client.post(
                f"https://api.telegram.org/bot{bot_token}/sendMessage",
                json={"chat_id": chat_id, "text": message, "parse_mode": "HTML"}
            )
            if resp.status_code == 200:
                logger.info(f"Telegram notification sent for order {order.get('tracking_code')}")
                return True
            else:
                logger.error(f"Telegram API error: {resp.status_code} - {resp.text}")
                return False
    except Exception as e:
        logger.error(f"Telegram notification failed: {e}")
        return False

async def send_customer_telegram(order):
    """Send result to customer via Telegram"""
    settings = await get_settings()
    bot_token = settings.get("telegram_bot_token", "")
    
    if not bot_token:
        logger.info("Telegram bot not configured")
        return False
    
    try:
        import httpx
        telegram_username = order.get("telegram", "").replace("@", "")
        message = f"\U0001f4cb VIN Yoxlama N\u0259tic\u0259si\n\nVIN: {order['vin']}\nAvtomobil: {order['car_model']}\n\n{order.get('result_text', '')}"
        
        # Note: Telegram bot can only send to users who have started a chat with the bot
        # This is a limitation - in production, you'd need the user's chat_id
        logger.info(f"Would send Telegram to @{telegram_username}: {message[:100]}...")
        return False  # Can't send without chat_id
    except Exception as e:
        logger.error(f"Telegram send failed: {e}")
        return False

async def send_customer_email(order):
    """Send result to customer via email"""
    settings = await get_settings()
    smtp_host = settings.get("smtp_host", "")
    smtp_user = settings.get("smtp_user", "")
    smtp_password = settings.get("smtp_password", "")
    
    if not smtp_host or not smtp_user:
        logger.info("SMTP not configured, skipping email")
        return False
    
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = order['email']
        msg['Subject'] = f"VIN Yoxlama N\u0259tic\u0259si - {order['vin']}"
        
        body = f"""Salam {order['name']},\n\nVIN yoxlama n\u0259tic\u0259niz haz\u0131rd\u0131r:\n\nVIN: {order['vin']}\nAvtomobil: {order['car_model']}\n\nN\u0259tic\u0259:\n{order.get('result_text', '')}\n\nH\u00f6rm\u0259tl\u0259,\nVINCODE Komandas\u0131"""
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        smtp_port = settings.get("smtp_port", 587)
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False

# ==================== INCLUDE ROUTER ====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

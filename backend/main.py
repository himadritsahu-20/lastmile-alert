from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(title="LastMile Alert API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class AlertInput(BaseModel):
    alert_type: str
    severity: str
    affected_area: str
    official_text: str

class TranslateRequest(BaseModel):
    text: str
    target_language: str

# Sample simplified texts
SIMPLIFIED = {
    "flood": """🚨 FLOOD WARNING - LEAVE NOW!
Water levels are HIGH and rising FAST.
📍 WHERE: Zone A, District 5
⏰ WHEN: Leave in next 4 HOURS
✅ DO: Evacuate immediately | Go to high ground
📞 CALL: 112 | Flood Helpline: 1070""",
    
    "cyclone": """🌀 CYCLONE ALERT - GET READY!
Strong storm is coming to coastal areas.
📍 WHERE: All coastal zones
⏰ WHEN: Storm arrives in 36-48 hours
✅ DO: Stock food/water | Know shelter location
📞 CALL: 112 | Coastguard: 1554"""
}

TRANSLATIONS = {
    "hindi": {
        "flood": "🚨 बाढ़ की चेतावनी - अभी निकलें! पानी खतरनाक रूप से बढ़ रहा है। 📞 112 पर कॉल करें।",
        "cyclone": "🌀 चक्रवात चेतावनी! तूफान आ रहा है। सुरक्षित स्थान पर जाएं। 📞 112"
    },
    "bengali": {
        "flood": "🚨 বন্যা সতর্কবার্তা - এখনই সরুন! জল বিপজ্জনকভাবে বাড়ছে। 📞 112",
        "cyclone": "🌀 ঘূর্ণিঝড় সতর্কতা! ঝড় আসছে। নিরাপদ জায়গায় যান। 📞 112"
    },
    "tamil": {
        "flood": "🚨 வெள்ள எச்சரிக்கை - இப்போதே வெளியேறுங்கள்! 📞 112",
        "cyclone": "🌀 புயல் எச்சரிக்கை! புயல் வருகிறது. பாதுகாப்பான இடம் செல்லுங்கள். 📞 112"
    },
    "spanish": {
        "flood": "🚨 ALERTA INUNDACIÓN - ¡EVACÚE AHORA! Niveles de agua peligrosos. 📞 112",
        "cyclone": "🌀 ALERTA CICLÓN - ¡PREPÁRESE! Tormenta llega en 36-48 horas. 📞 112"
    }
}

# Routes
@app.get("/")
def root():
    return {"status": "LastMile Alert API Running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/alert/process")
def process_alert(alert: AlertInput):
    simplified = SIMPLIFIED.get(alert.alert_type, 
        f"🚨 EMERGENCY ALERT\n{alert.official_text[:200]}...\n📞 Call 112")
    
    sms_version = f"{alert.alert_type.upper()}-{alert.severity.upper()}|{alert.affected_area[:20]}|ACT:EVACUATE|CALL:112"
    
    return {
        "status": "success",
        "original": alert.official_text,
        "simplified": simplified,
        "sms_version": sms_version[:160],
        "key_info": {
            "what": alert.alert_type.capitalize(),
            "where": alert.affected_area,
            "when": "Immediate action required",
            "action": "Evacuate and call 112"
        }
    }

@app.post("/api/translate")
def translate_alert(request: TranslateRequest):
    lang = request.target_language.lower()
    
    # Check our translation bank first
    for alert_type, trans in TRANSLATIONS.get(lang, {}).items():
        if alert_type in request.text.lower():
            return {"status": "success", "language": lang, "translated": trans}
    
    # Fallback
    return {
        "status": "success", 
        "language": lang,
        "translated": f"[{lang.upper()}] {request.text[:200]}"
    }

@app.get("/api/delivery/stats")
def delivery_stats():
    return {
        "total_sent": 1250,
        "delivered": 1175,
        "read": 1050,
        "acknowledged": 980,
        "failed": 75,
        "delivery_rate": 94.0,
        "read_rate": 84.0,
        "ack_rate": 78.4
    }

@app.get("/api/delivery/recipients")
def get_recipients():
    return [
        {"id": "R001", "name": "Amit Kumar", "zone": "A", 
         "channel": "SMS", "status": "read", "ack": True},
        {"id": "R002", "name": "Priya Sharma", "zone": "A", 
         "channel": "App", "status": "delivered", "ack": False},
        {"id": "R003", "name": "Ravi Das", "zone": "B", 
         "channel": "SMS", "status": "acknowledged", "ack": True},
        {"id": "R004", "name": "Fatima Begum", "zone": "B", 
         "channel": "Radio", "status": "delivered", "ack": False},
        {"id": "R005", "name": "John Xavier", "zone": "C", 
         "channel": "SMS", "status": "failed", "ack": False},
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
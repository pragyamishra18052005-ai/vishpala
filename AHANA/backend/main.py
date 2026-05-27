from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import random
from sklearn.ensemble import IsolationForest

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

random.seed(42)
np.random.seed(42)

otp_store = {}

class Event(BaseModel):
    key: str
    keydown: int
    keyup: int
    dwell: int

class UserData(BaseModel):
    user_id: str
    session_id: int
    events: list[Event]

class OTPVerify(BaseModel):
    user_id: str
    otp: str

def extract_features(events):
    dwell_times = [e.dwell for e in events]
    flight_times = []
    for i in range(1, len(events)):
        flight = events[i].keydown - events[i-1].keyup
        flight_times.append(flight)
    total_time = events[-1].keyup - events[0].keydown
    num_keys = len(events)
    avg_dwell = np.mean(dwell_times)
    std_dwell = np.std(dwell_times)
    avg_flight = np.mean(flight_times) if flight_times else 0
    std_flight = np.std(flight_times) if flight_times else 0
    wpm = (num_keys / 5) / (total_time / 60000) if total_time > 0 else 0
    return [avg_dwell, std_dwell, avg_flight, std_flight, wpm, total_time, num_keys, np.var(dwell_times)]

X_train = []
for _ in range(1000):
    events = []
    current_time = 1000
    for _ in range(20):
        dwell = random.randint(60, 400)
        flight = random.randint(60, 450)
        keydown = current_time
        keyup = keydown + dwell
        events.append({"keydown": keydown, "keyup": keyup, "dwell": dwell})
        current_time = keyup + flight
    events_obj = [type("obj", (), e)() for e in events]
    features = extract_features(events_obj)
    X_train.append(features)

X_train = np.array(X_train)
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X_train)
print("✅ Model trained")

train_scores = model.score_samples(X_train)
min_s = train_scores.min()
max_s = train_scores.max()

@app.get("/")
def home():
    return {"message": "VISHPALA API running"}

@app.post("/score")
def score_user(data: UserData):
    if len(data.events) < 3:
        return {"score": 55, "risk": "LOW", "action": "ALLOW", "inference_ms": 20}
    features = extract_features(data.events)
    X = np.array([features])
    raw_score = model.score_samples(X)[0]
    score = int(100 * (raw_score - min_s) / (max_s - min_s + 1e-6))
    score = max(0, min(100, score))
    score = max(55, score)
    if score >= 50:
        risk, action = "LOW", "ALLOW"
    elif score >= 25:
        risk, action = "MEDIUM", "2FA"
    else:
        risk, action = "HIGH", "BLOCK"
    return {"score": score, "risk": risk, "action": action, "inference_ms": 20}

@app.post("/generate-otp")
def generate_otp(data: dict):
    user_id = data.get("user_id", "user_001")
    otp = str(random.randint(100000, 999999))
    otp_store[user_id] = otp
    print(f"OTP for {user_id}: {otp}")
    return {"message": "OTP generated", "otp": otp, "user_id": user_id}

@app.post("/verify-otp")
def verify_otp(data: OTPVerify):
    stored_otp = otp_store.get(data.user_id)
    if stored_otp and stored_otp == data.otp:
        del otp_store[data.user_id]
        return {"verified": True, "message": "OTP verified successfully"}
    return {"verified": False, "message": "Invalid OTP"}
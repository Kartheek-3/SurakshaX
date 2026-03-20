from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt
from pymongo import MongoClient
import redis
import os
from dotenv import load_dotenv
import joblib
import sys
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import requests
import time
import threading

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'gigshield-super-secret-key-change-in-prod'  # Change in production
jwt = JWTManager(app)
CORS(app)

# Database connections
mongo_client = MongoClient('mongodb://root:example@localhost:27017/surakshax?authSource=admin')
db = mongo_client['surakshax']
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# AI models
model_path = os.path.join(os.path.dirname(__file__), '..', 'ai', 'digital_twin_model.joblib')
model = joblib.load(model_path)

sys.path.append(os.path.dirname(__file__) + '/../ai')
from fraud_detection import SwarmFraudDetector
fraud_detector = SwarmFraudDetector()

users = db['users']
policies = db['policies']
claims = db['claims']
weather_events = db['weather_events']

# Seed admin
def seed_admin():
    admin = users.find_one({'phone': 'admin'})
    if not admin:
        admin_id = users.insert_one({
            'name': 'System Admin',
            'phone': 'admin',
            'city': 'All',
            'platform': 'Admin',
            'created_at': datetime.utcnow()
        }).inserted_id
        print('Admin seeded:', str(admin_id))

seed_admin()

# Cities for weather monitoring
CITIES = [
    {'city': 'Mumbai', 'lat': 19.0760, 'lon': 72.8777},
    {'city': 'Delhi', 'lat': 28.6139, 'lon': 77.2090},
    {'city': 'Bangalore', 'lat': 12.9716, 'lon': 77.5946},
    {'city': 'Hyderabad', 'lat': 17.3850, 'lon': 78.4867},
    {'city': 'Chennai', 'lat': 13.0827, 'lon': 80.2707},
    {'city': 'Kolkata', 'lat': 22.5726, 'lon': 88.3639},
    {'city': 'Vijayawada', 'lat': 16.5062, 'lon': 80.6480}  # Added for user
]

WEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

def fetch_weather(city):
    if WEATHER_API_KEY:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={city['lat']}&lon={city['lon']}&appid={WEATHER_API_KEY}&units=metric"
        try:
            resp = requests.get(url, timeout=10)
            data = resp.json()
            rainfall = data.get('rain', {}).get('1h', 0)
            temp = data.get('main', {}).get('temp', 0)
        except:
            rainfall, temp = 0, 25
    else:
        # Fallback simulation
        rainfall = 25 + (time.time() % 60)  # Random rain 25-85mm
        temp = 28 + (time.time() % 10)
    
    return {'city': city['city'], 'rainfall': rainfall, 'temperature': temp, 'event_time': datetime.utcnow()}

def auto_claim_process():
    print('Running weather check...')
    for city in CITIES:
        weather = fetch_weather(city)
        weather_events.insert_one(weather)
        
        if weather['rainfall'] > 30:
            print(f'Auto-claim trigger for {weather["city"]} (rain: {weather["rainfall"]}mm)')
            
            active_policies = policies.find({'status': 'active'})
            
            today = datetime.utcnow().date()
            for policy in active_policies:
                user_id = policy['user_id']
                user_city = users.find_one({'_id': ObjectId(user_id)})['city'] if 'user_id' in policy else 'Mumbai'
                if user_city == weather['city']:
                    recent_claim = claims.find_one({
                        'user_id': user_id,
                        'disruption': 'auto_weather',
                        'created_at': {'$gte': datetime(today.year, today.month, today.day)}
                    })
                    if not recent_claim:
                        payout = policy.get('coverage_amount', 15000) * 0.2
                        claims.insert_one({
                            'user_id': user_id,
                            'disruption': 'auto_weather',
                            'disruption_city': weather['city'],
                            'payout': payout,
                            'status': 'approved',
                            'created_at': datetime.utcnow(),
                            'auto': True
                        })
                        print(f'Auto claim {payout} for user {user_id}')

# Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=auto_claim_process, trigger="interval", minutes=10)
scheduler.start()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'scheduler': scheduler.state})

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    phone = data['phone']
    
    # Demo upsert - always succeed
    user_doc = {
        'name': data['name'],
        'phone': phone,
        'city': data['city'],
        'platform': data['platform'],
        'created_at': datetime.utcnow()
    }
    result = users.update_one({'phone': phone}, {'$set': user_doc}, upsert=True)
    if result.upserted_id:
        user_doc['_id'] = str(result.upserted_id)
    else:
        user_doc['_id'] = str(users.find_one({'phone': phone})['_id'])
    
    token = create_access_token(identity=user_doc['_id'])
    return jsonify({'user': user_doc, 'token': token})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    phone = data['phone']
    
    user = users.find_one({'phone': phone})
    if not user:
        return jsonify({'error': 'Phone not found'}), 401
    
    user['_id'] = str(user['_id'])
    token = create_access_token(identity=str(user['_id']))
    return jsonify({'user': user, 'token': token})

# ... rest unchanged


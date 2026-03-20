# SurakshaX - AI Digital Twin Insurance for Gig Workers 
## About the Project

---

## Weekly Dynamic Pricing Model

 - Premium = Base + (RiskScore × ExposureHours)


Where:
- RiskScore is based on local disruption probability  
- ExposureHours represent weekly working hours  

Pricing adjusts dynamically based on:
- Location  
- Weather patterns  
- Worker behavior  

---

## Hyperlocal Risk Intelligence
SurakshaX provides a real-time risk heatmap:

- High-risk zones  
- Moderate-risk zones  
- Safe zones  

Workers can use this data to:
- Plan routes  
- Optimize earnings  
- Avoid high-risk areas  

---

## AI/ML Integration
- Income prediction using digital twins  
- Dynamic pricing models  
- Fraud detection systems  
- Cluster-based fraud analysis  
- Predictive disruption modeling  

---

## System Architecture

### Data Layer
- Weather data APIs or simulated data  
- Air quality data  
- User activity simulation  

### AI Layer
- Income prediction models  
- Fraud detection engine  
- Risk scoring system  

### Application Layer
- User onboarding  
- Policy management  
- Claim automation  

### Payment Layer
- Simulated instant payout system

---

##  Features
- **Digital Twin AI**: Predicts daily earnings, auto-payouts disruption loss
- **Parametric Triggers**: Rain >30mm, AQI hazards → instant claims
- **Swarm Fraud Detection**: Graph clustering detects fraud networks
- **Dynamic Pricing**: Risk × hours personalized premiums
- **Admin Dashboard**: Live stats, users, claims, weather events
- **Phone Auth**: JWT backend + protected routes
- **Weather Scheduler**: 7 cities, auto-claims every 10min

##  Tech Stack
**Frontend**: React 18 + Vite + Tailwind + Recharts + React Router
**Backend**: Flask + MongoDB + Redis + APScheduler + flask-jwt-extended
**AI/ML**: Scikit-learn (RandomForest) + NetworkX (fraud graphs)
**APIs**: OpenWeather (or simulated fallback)

##  Quick Start

### 1. Backend + DB (docker-compose)
```bash
docker-compose up -d  # Mongo + Redis
pip install -r backend/requirements.txt ai/requirements.txt
python ai/digital_twin.py  # Train model
cd backend && python app.py
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev  # localhost:5173
```

### 3. Test Flow
```
1. localhost:5173 → Sign up (7981836130, Kartheek Mudi, Vijayawada, Zomato)
2. /buy-policy → Buy coverage (AI premium)
3. Backend logs auto-claims (rain >30mm)
4. Login "admin" → /admin dashboard live data
5. /trigger_claim → Digital twin payout calc
```

##  Next Level Features Added
- BuyPolicy: Dynamic pricing + AI prediction
- AdminPanel: Real-time stats/tabs
- Protected routes (user/admin)
- Backend weather scheduler (Vijayawada included)
- Demo fallback (backend optional)

##  Roadmap
- OTP phone verification
- Razorpay/Stripe payments
- Real-time WebSocket claims
- Mobile PWA
- More AI (LSTM earnings + GPS fraud)

## Challenges Addressed
- Designing fair AI-based compensation models  
- Detecting advanced GPS spoofing fraud  
- Maintaining a simple user experience with complex backend systems  
- Balancing automation with trust and transparency  

---

## Conclusion
SurakshaX redefines insurance for gig workers. Instead of reacting to events, it predicts income loss and ensures workers are compensated for missed opportunities. It is a proactive financial safety system built on data, intelligence, and fairness. 




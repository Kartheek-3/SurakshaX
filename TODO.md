# GigShield AI Extension Plan (Approved)
Extending SurakshaX with phone auth, admin panel, weather scheduler (fallback sim).

## Step 1: Backend Deps & Auth
- [x] pip install flask-jwt-extended apscheduler requests python-dotenv
- [x] Add /register /login (phone JWT), seed admin 'admin'
- [x] Protect APIs with JWT
- [x] Admin APIs, scheduler running every 10min (fallback sim OK)

## Step 2: Backend Features
- [ ] /buy_policy (JWT user)
- [ ] Admin APIs: stats/users/claims/weather_events
- [ ] APScheduler 10min: OpenWeather 6 cities → weather_events → auto-claims (rain>30mm, 20% coverage)

## Step 3: Frontend Auth
- [ ] AuthContext (JWT)
- [ ] Login/Signup pages
- [ ] Route protect (user/admin)

## Step 4: New Pages
- [ ] BuyPolicy component
- [ ] AdminPanel (tabs: stats, workers, claims, weather)

## Step 5: Test & Polish
- [ ] Test auth/auto-claim
- [ ] Update README

**Progress: 0/5**


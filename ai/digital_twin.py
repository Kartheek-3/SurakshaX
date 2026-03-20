import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import json
import os

class DigitalTwin:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
    
    def load_data(self, filepath='e:/SurakshaX/data/simulated_workers.json'):
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        df = pd.DataFrame(data)
        df['avg_earnings'] = df['historical_earnings'].apply(np.mean)
        df['avg_hours'] = df['hours_worked'].apply(np.mean)
        return df
    
    def prepare_features(self, df):
        features = ['avg_earnings', 'avg_hours', 'risk_score']
        X = df[features]
        y = df['avg_earnings'] * df['avg_hours'] * 1.1  # Expected daily income
        return X, y
    
    def train(self):
        df = self.load_data()
        X, y = self.prepare_features(df)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        preds = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        print(f"Model trained! MAE: {mae:.2f}")
        
        self.is_trained = True
        joblib.dump(self.model, 'e:/SurakshaX/ai/digital_twin_model.joblib')
    
    def predict(self, features):
        if not self.is_trained:
            self.train()
        return self.model.predict([features])[0]

# Usage
if __name__ == "__main__":
    twin = DigitalTwin()
    pred = twin.predict([220, 8, 0.7])  # avg_earnings, avg_hours, risk_score
    print(f"Predicted daily income: ₹{pred:.2f}")


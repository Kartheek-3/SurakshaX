import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
from collections import defaultdict
import json

class SwarmFraudDetector:
    def __init__(self):
        self.G = nx.Graph()
    
    def load_claims(self, claims_data):
        """Simulate loading claims from DB"""
        return [
            {'user_id': 'worker_001', 'timestamp': 1728000000, 'amount': 120, 'location': (19.0760, 72.8777), 'disruption': 'rain'},
            {'user_id': 'worker_002', 'timestamp': 1728001200, 'amount': 115, 'location': (19.0765, 72.8780), 'disruption': 'rain'},
            {'user_id': 'worker_003', 'timestamp': 1728002400, 'amount': 130, 'location': (19.0755, 72.8770), 'disruption': 'rain'},
            # Fraud cluster - simultaneous claims nearby
            {'user_id': 'fraud_1', 'timestamp': 1728000000, 'amount': 100, 'location': (19.0762, 72.8778), 'disruption': 'rain'},
            {'user_id': 'fraud_2', 'timestamp': 1728000100, 'amount': 105, 'location': (19.0761, 72.8779), 'disruption': 'rain'},
            {'user_id': 'fraud_3', 'timestamp': 1728000200, 'amount': 110, 'location': (19.0759, 72.8776), 'disruption': 'rain'},
        ]
    
    def build_graph(self, claims, time_window=1800, dist_threshold=0.1):  # 30min, 100m
        self.G.clear()
        
        for i, claim1 in enumerate(claims):
            for j, claim2 in enumerate(claims[i+1:], i+1):
                time_diff = abs(claim1['timestamp'] - claim2['timestamp'])
                dist = self.haversine(claim1['location'], claim2['location'])
                
                if time_diff < time_window and dist < dist_threshold:
                    self.G.add_edge(claim1['user_id'], claim2['user_id'], 
                                  weight=time_diff + dist*1000)
        
        return self.G
    
    def detect_clusters(self):
        """Swarm fraud = dense clusters of simultaneous claims"""
        clusters = list(nx.connected_components(self.G))
        fraud_scores = []
        
        for cluster in clusters:
            if len(cluster) >= 3:  # 3+ simultaneous claims = suspicious
                subgraph = self.G.subgraph(cluster)
                density = nx.density(subgraph)
                fraud_score = len(cluster) * density
                fraud_scores.append((cluster, fraud_score))
        
        return sorted(fraud_scores, key=lambda x: x[1], reverse=True)
    
    def haversine(self, coord1, coord2):
        R = 6371  # Earth radius in km
        lat1, lon1 = np.radians(coord1)
        lat2, lon2 = np.radians(coord2)
        dlat, dlon = lat2-lat1, lon2-lon1
        a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
        c = 2*np.arctan2(np.sqrt(a), np.sqrt(1-a))
        return R * c * 1000  # meters
    
    def visualize(self):
        pos = nx.spring_layout(self.G)
        nx.draw(self.G, pos, with_labels=True, node_color='lightblue', 
                node_size=500, font_size=10, font_weight='bold')
        plt.title('Fraud Network Graph')
        # plt.show()  # Disabled for server use

# Demo
if __name__ == "__main__":
    detector = SwarmFraudDetector()
    claims = detector.load_claims()
    G = detector.build_graph(claims)
    frauds = detector.detect_clusters()
    
    print("Detected Fraud Swarms:")
    for cluster, score in frauds:
        print(f"Fraud Score {score:.2f}: {list(cluster)}")


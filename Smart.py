# smart plant project 
## *3. Code (Prototype)*

### *Plant Species Classifier (Python + TensorFlow):*

# python
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np

def load_classifier_model(model_path='plant_classifier_model.h5'):
    """Load the pre-trained plant classification model with error handling."""
    try:
        model = tf.keras.models.load_model(model_path)
        return model
    except Exception as e:
        raise Exception(f"Failed to load model: {str(e)}")

model = load_classifier_model()

def classify_species(img_path):
    """Classify plant species from an image with proper error handling."""
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction)
        confidence = float(np.max(prediction))  # Convert to native Python float
        
        return predicted_class, confidence
    except Exception as e:
        raise Exception(f"Classification failed: {str(e)}")


### *Geolocation + Logging:*

# python
import json
import datetime
from pathlib import Path

def log_species_data(species_id, lat, lon, log_file="species_log.json"):
    """Log species data with geolocation and timestamp."""
    try:
        data = {
            "species_id": int(species_id),
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "location": {"lat": float(lat), "lon": float(lon)}
        }
        
        # Ensure directory exists
        Path(log_file).parent.mkdir(parents=True, exist_ok=True)
        
        with open(log_file, "a", encoding='utf-8') as f:
            json.dump(data, f)
            f.write("\n")
    except Exception as e:
        raise Exception(f"Failed to log data: {str(e)}")


### *Reforestation Suggestion Engine (Using Weather API):*

# python
import requests
from typing import List

def suggest_trees(lat: float, lon: float, api_key: str) -> List[str]:
    """Suggest appropriate tree species based on local climate conditions."""
    try:
        # Fetch climate data
        weather_api = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        response = requests.get(weather_api, timeout=10)
        response.raise_for_status()
        weather_data = response.json()
        
        temp = weather_data['main']['temp']
        rainfall = weather_data.get('rain', {}).get('1h', 0)

        # Improved suggestion logic with more species options
        if temp < 15 and rainfall > 5:  # Cool and wet
            return ["Oak", "Maple", "Beech", "Spruce"]
        elif temp > 27:  # Hot climate
            return ["Baobab", "Neem", "Acacia", "Date Palm"]
        elif 15 <= temp <= 27 and rainfall > 3:  # Temperate with good rainfall
            return ["Pine", "Cedar", "Redwood", "Birch"]
        else:  # Default for moderate conditions
            return ["Willow", "Poplar", "Ash", "Elm"]
            
    except requests.exceptions.RequestException as e:
        raise Exception(f"Weather API request failed: {str(e)}")
    except KeyError as e:
        raise Exception(f"Invalid weather data format: {str(e)}")
    except Exception as e:
        raise Exception(f"Tree suggestion failed: {str(e)}")
    
# Example usage:
try:
    # Classify a plant
    species_id, confidence = classify_species("plant_image.jpg")
    
    # Get location (in real app this would come from GPS)
    latitude = 37.7749
    longitude = -122.4194
    
    # Log the finding
    log_species_data(species_id, latitude, longitude)
    
    # Get reforestation suggestions
    suggestions = suggest_trees(latitude, longitude, "your_api_key_here")
    print(f"Suggested trees: {', '.join(suggestions)}")
    
except Exception as e:
    print(f"Error: {str(e)}")
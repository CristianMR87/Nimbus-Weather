from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime, timezone, timedelta

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# API Key from OpenWeather
api_key = '70529b5640e2a185b9885cb8b938002a'

def convert_wind_speed_to_kmh(wind_speed_mps):
    """Converts wind speed from m/s to km/h."""
    return round(wind_speed_mps * 3.6, 1)

def calculate_rain_probability(rain_mm):
    """Calculates rain probability percentage based on rainfall amount (mm)."""
    if rain_mm > 0:
        # Maps rainfall amount to a percentage
        return min(round(rain_mm * 100), 100)  # Ensure it doesn't exceed 100%
    return 0

@app.route('/weather/<city>', methods=['GET'])
def get_weather_by_city(city):
    current_url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    forecast_url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'

    try:
        # Fetch current weather
        current_response = requests.get(current_url)
        if current_response.status_code != 200:
            return jsonify({"error": "Unable to get current weather for this city"}), 500
        current_data = current_response.json()

        # Fetch forecast
        forecast_response = requests.get(forecast_url)
        if forecast_response.status_code != 200:
            return jsonify({"error": "Unable to get the forecast for this city"}), 500
        forecast_data = forecast_response.json()

        # Current weather data
        city_name = current_data["name"]
        sunrise = current_data["sys"].get("sunrise")
        sunset = current_data["sys"].get("sunset")
        
        # Convert wind speed to km/h
        wind_speed_kmh = convert_wind_speed_to_kmh(current_data["wind"]["speed"])

        current_weather = {
            "temperature": round(current_data["main"]["temp"]),
            "sunrise": datetime.fromtimestamp(sunrise, tz=timezone.utc).strftime('%H:%M') if sunrise else "Not available",
            "sunset": datetime.fromtimestamp(sunset, tz=timezone.utc).strftime('%H:%M') if sunset else "Not available",
            "wind_speed": wind_speed_kmh,
            "humidity": current_data["main"]["humidity"],
            "rain_probability": calculate_rain_probability(current_data.get('rain', {}).get('1h', 0)),
            "icon": current_data["weather"][0]["icon"]
        }

        # Get today's date
        today_date = datetime.now().strftime('%Y-%m-%d')

        # Hourly forecast for today and the next 15 hours
        current_time = datetime.now()
        hourly_forecast = [
            {
                "time": item["dt_txt"],
                "temperature": round(item["main"]["temp"]),
                "description": item["weather"][0]["description"],
                "rain_probability": calculate_rain_probability(item.get('rain', {}).get('3h', 0)),
                "icon": item["weather"][0]["icon"]
            }
            for item in forecast_data['list']
            if current_time <= datetime.strptime(item["dt_txt"], '%Y-%m-%d %H:%M:%S') <= current_time + timedelta(hours=15)
        ]

        # Daily forecast (max/min temperatures, icon, and rain probability)
        daily_forecast = {}
        for item in forecast_data['list']:
            date = item['dt_txt'].split()[0]  # Extract date (yyyy-mm-dd)

            if date not in daily_forecast:
                daily_forecast[date] = {
                    'temperature': [],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'rain_probability': 0
                }

            daily_forecast[date]['temperature'].append(item['main']['temp'])
            rain = item.get('rain', {}).get('3h', 0)
            daily_forecast[date]['rain_probability'] = max(daily_forecast[date]['rain_probability'], rain)

        # Calculate max/min temperatures per day
        forecast_data_list = []
        for date, details in daily_forecast.items():
            avg_temp = sum(details['temperature']) / len(details['temperature'])
            max_temp = max(details['temperature'])
            min_temp = min(details['temperature'])
            forecast_data_list.append({
                "date": date,
                "temperature_avg": round(avg_temp),
                "temperature_max": round(max_temp),
                "temperature_min": round(min_temp),
                "description": details['description'],
                "icon": details['icon'],
                "rain_probability": calculate_rain_probability(details['rain_probability'])
            })

        # Filter the next 5 days
        next_five_days_forecast = forecast_data_list[:5]

        # Filter today's general forecast
        today_forecast = next((forecast for forecast in forecast_data_list if forecast["date"] == today_date), None)

        return jsonify({
            "city": city_name,
            "current_weather": current_weather,
            "forecast": today_forecast,
            "hourly_forecast": hourly_forecast,
            "daily_forecast": next_five_days_forecast
        })

    except Exception as e:
        print(f"Error fetching or processing weather data: {str(e)}")
        return jsonify({"error": f"Error fetching or processing weather data: {str(e)}"}), 500

@app.route('/weather', methods=['GET'])
def get_weather_by_location():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    current_url = f'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric'
    forecast_url = f'http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric'

    try:
        # Fetch current weather
        current_response = requests.get(current_url)
        if current_response.status_code != 200:
            return jsonify({"error": "Unable to get current weather for these coordinates"}), 500
        current_data = current_response.json()

        # Fetch forecast
        forecast_response = requests.get(forecast_url)
        if forecast_response.status_code != 200:
            return jsonify({"error": "Unable to get the forecast for these coordinates"}), 500
        forecast_data = forecast_response.json()

        # Current weather data
        city_name = current_data["name"]
        sunrise = current_data["sys"].get("sunrise")
        sunset = current_data["sys"].get("sunset")

        # Convert wind speed to km/h
        wind_speed_kmh = convert_wind_speed_to_kmh(current_data["wind"]["speed"])

        current_weather = {
            "temperature": round(current_data["main"]["temp"]),
            "sunrise": datetime.fromtimestamp(sunrise, tz=timezone.utc).strftime('%H:%M') if sunrise else "Not available",
            "sunset": datetime.fromtimestamp(sunset, tz=timezone.utc).strftime('%H:%M') if sunset else "Not available",
            "wind_speed": wind_speed_kmh,
            "humidity": current_data["main"]["humidity"],
            "rain_probability": calculate_rain_probability(current_data.get('rain', {}).get('1h', 0)),
            "icon": current_data["weather"][0]["icon"]
        }

        # Get today's date
        today_date = datetime.now().strftime('%Y-%m-%d')

        # Hourly forecast for today and the next 15 hours
        current_time = datetime.now()
        hourly_forecast = [
            {
                "time": item["dt_txt"],
                "temperature": round(item["main"]["temp"]),
                "description": item["weather"][0]["description"],
                "rain_probability": calculate_rain_probability(item.get('rain', {}).get('3h', 0)),
                "icon": item["weather"][0]["icon"]
            }
            for item in forecast_data['list']
            if current_time <= datetime.strptime(item["dt_txt"], '%Y-%m-%d %H:%M:%S') <= current_time + timedelta(hours=15)
        ]

        # Daily forecast (max/min temperatures, icon, and rain probability)
        daily_forecast = {}
        for item in forecast_data['list']:
            date = item['dt_txt'].split()[0]
            if date not in daily_forecast:
                daily_forecast[date] = {
                    'temperature': [],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'rain_probability': 0
                }
            daily_forecast[date]['temperature'].append(item['main']['temp'])
            rain = item.get('rain', {}).get('3h', 0)
            daily_forecast[date]['rain_probability'] = max(daily_forecast[date]['rain_probability'], rain)

        # Calculate max/min temperatures per day
        forecast_data_list = []
        for date, details in daily_forecast.items():
            avg_temp = sum(details['temperature']) / len(details['temperature'])
            max_temp = max(details['temperature'])
            min_temp = min(details['temperature'])
            forecast_data_list.append({
                "date": date,
                "temperature_avg": round(avg_temp),
                "temperature_max": round(max_temp),
                "temperature_min": round(min_temp),
                "description": details['description'],
                "icon": details['icon'],
                "rain_probability": calculate_rain_probability(details['rain_probability'])
            })

        # Filter the next 5 days
        next_five_days_forecast = forecast_data_list[:5]
        # Filter today's general forecast
        today_forecast = next((forecast for forecast in forecast_data_list if forecast["date"] == today_date), None)

        return jsonify({
            "city": city_name,
            "current_weather": current_weather,
            "forecast": today_forecast,
            "hourly_forecast": hourly_forecast,
            "daily_forecast": next_five_days_forecast
        })

    except Exception as e:
        print(f"Error fetching or processing weather data: {str(e)}")
        return jsonify({"error": f"Error fetching or processing weather data: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
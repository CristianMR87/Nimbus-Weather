from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime, timezone, timedelta

app = Flask(__name__)
CORS(app)

# Clave API de OpenWeather
api_key = '70529b5640e2a185b9885cb8b938002a'

@app.route('/weather/<city>', methods=['GET'])
def get_weather_by_city(city):
    # URLs para obtener el clima actual y la previsión
    current_url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    forecast_url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'

    try:
        # Obtener clima actual
        current_response = requests.get(current_url)
        if current_response.status_code != 200:
            return jsonify({"error": "No se pudo obtener el clima actual para esta ciudad"}), 500
        current_data = current_response.json()

        # Obtener previsión
        forecast_response = requests.get(forecast_url)
        if forecast_response.status_code != 200:
            return jsonify({"error": "No se pudo obtener la previsión para esta ciudad"}), 500
        forecast_data = forecast_response.json()

        # Datos del clima actual
        city_name = current_data["name"]
        sunrise = current_data["sys"].get("sunrise")
        sunset = current_data["sys"].get("sunset")
        current_weather = {
            "temperature": round(current_data["main"]["temp"]),
            "sunrise": datetime.fromtimestamp(sunrise, tz=timezone.utc).strftime('%H:%M') if sunrise else "No disponible",
            "sunset": datetime.fromtimestamp(sunset, tz=timezone.utc).strftime('%H:%M') if sunset else "No disponible",
            "wind_speed": current_data["wind"]["speed"],
            "humidity": current_data["main"]["humidity"],
            "icon": current_data["weather"][0]["icon"]
        }

        # Obtener la fecha de hoy
        today_date = datetime.now().strftime('%Y-%m-%d')

        # Previsión por horas para hoy y las siguientes 24 horas
        current_time = datetime.now()
        hourly_forecast = [
            {
                "time": item["dt_txt"],
                "temperature": round(item["main"]["temp"]),
                "description": item["weather"][0]["description"],
                "icon": item["weather"][0]["icon"]
            }
            for item in forecast_data['list']
            if current_time <= datetime.strptime(item["dt_txt"], '%Y-%m-%d %H:%M:%S') <= current_time + timedelta(hours=15)
        ]

        # Previsión por días (máximas, mínimas, icono)
        daily_forecast = {}
        for item in forecast_data['list']:
            date = item['dt_txt'].split()[0]  # Obtiene solo la fecha (yyyy-mm-dd)

            if date not in daily_forecast:
                daily_forecast[date] = {
                    'temperature': [],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                }

            daily_forecast[date]['temperature'].append(item['main']['temp'])

        # Calculamos la temperatura máxima y mínima por día
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
                "icon": details['icon']
            })

        # Filtrar los próximos 5 días después de hoy
        next_five_days_forecast = forecast_data_list[:5]

        # Filtrar solo la predicción general del día de hoy
        today_forecast = next((forecast for forecast in forecast_data_list if forecast["date"] == today_date), None)

        return jsonify({
            "city": city_name,
            "current_weather": current_weather,
            "forecast": today_forecast,  # Predicción general del día de hoy
            "hourly_forecast": hourly_forecast,  # Predicciones horarias
            "daily_forecast": next_five_days_forecast  # Predicción extendida para los próximos días
        })

    except Exception as e:
        print(f"Error fetching or processing weather data: {str(e)}")
        return jsonify({"error": f"Error al procesar los datos del clima: {str(e)}"}), 500

@app.route('/weather', methods=['GET'])
def get_weather_by_location():
    # Obtener latitud y longitud desde los parámetros de la URL
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Se requieren las coordenadas (latitud y longitud)"}), 400

    # URLs para obtener el clima actual y la previsión
    current_url = f'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric'
    forecast_url = f'http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric'

    try:
        # Obtener clima actual
        current_response = requests.get(current_url)
        if current_response.status_code != 200:
            return jsonify({"error": "No se pudo obtener el clima actual para estas coordenadas"}), 500
        current_data = current_response.json()

        # Obtener previsión
        forecast_response = requests.get(forecast_url)
        if forecast_response.status_code != 200:
            return jsonify({"error": "No se pudo obtener la previsión para estas coordenadas"}), 500
        forecast_data = forecast_response.json()

        # Datos del clima actual
        city_name = current_data["name"]
        sunrise = current_data["sys"].get("sunrise")
        sunset = current_data["sys"].get("sunset")
        current_weather = {
            "temperature": round(current_data["main"]["temp"]),
            "sunrise": datetime.fromtimestamp(sunrise, tz=timezone.utc).strftime('%H:%M') if sunrise else "No disponible",
            "sunset": datetime.fromtimestamp(sunset, tz=timezone.utc).strftime('%H:%M') if sunset else "No disponible",
            "wind_speed": current_data["wind"]["speed"],
            "humidity": current_data["main"]["humidity"],
            "icon": current_data["weather"][0]["icon"]
        }

        # Obtener la fecha de hoy
        today_date = datetime.now().strftime('%Y-%m-%d')

        # Previsión por horas para hoy y las siguientes 24 horas
        current_time = datetime.now()
        hourly_forecast = [
            {
                "time": item["dt_txt"],
                "temperature": round(item["main"]["temp"]),
                "description": item["weather"][0]["description"],
                "icon": item["weather"][0]["icon"]
            }
            for item in forecast_data['list']
            if current_time <= datetime.strptime(item["dt_txt"], '%Y-%m-%d %H:%M:%S') <= current_time + timedelta(hours=15)
        ]

        # Previsión por días (máximas, mínimas, icono)
        daily_forecast = {}
        for item in forecast_data['list']:
            date = item['dt_txt'].split()[0]  # Obtiene solo la fecha (yyyy-mm-dd)

            if date not in daily_forecast:
                daily_forecast[date] = {
                    'temperature': [],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                }

            daily_forecast[date]['temperature'].append(item['main']['temp'])

        # Calculamos la temperatura máxima y mínima por día
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
                "icon": details['icon']
            })

        # Filtrar los próximos 5 días después de hoy
        next_five_days_forecast = forecast_data_list[:5]

        # Filtrar solo la predicción general del día de hoy
        today_forecast = next((forecast for forecast in forecast_data_list if forecast["date"] == today_date), None)

        return jsonify({
            "city": city_name,
            "current_weather": current_weather,
            "forecast": today_forecast,  # Predicción general del día de hoy
            "hourly_forecast": hourly_forecast,  # Predicciones horarias
            "daily_forecast": next_five_days_forecast  # Predicción extendida para los próximos días
        })

    except Exception as e:
        print(f"Error fetching or processing weather data: {str(e)}")
        return jsonify({"error": f"Error al procesar los datos del clima: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)

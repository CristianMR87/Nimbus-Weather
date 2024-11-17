from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  

@app.route('/weather/<city>', methods=['GET'])
def get_weather(city):
    api_key = '70529b5640e2a185b9885cb8b938002a'  # API key from OpenWeather
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}'
    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()

        weather_info = {
            "city": data["name"],
            "temperature": round(data["main"]["temp"] - 273.15, 2),  # Conversión to Celsius
            "description": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"]
        }

        return jsonify(weather_info)
    else:
        return jsonify({"error": "No se pudo obtener el clima para esa ciudad"}), 500

if __name__ == '__main__':
    app.run(debug=True)
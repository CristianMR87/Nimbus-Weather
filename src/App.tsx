import React, { useState, useEffect } from 'react';

interface Forecast {
    date: string;
    temperature: number;
    description: string;
    icon: string;
}

interface HourlyForecast {
    time: string;
    temperature: number;
    description: string;
    icon: string;
}

interface DailyForecast {
    date: string;
    temperature_max: number;
    temperature_min: number;
    icon: string;
    description: string;
}

interface CurrentWeather {
    temperature: number;
    sunrise: string;
    sunset: string;
    wind_speed: number;
    humidity: number;
    icon: string;
}

interface WeatherData {
    city: string;
    current_weather: CurrentWeather;
    forecast: Forecast | null;
    hourly_forecast: HourlyForecast[];
    daily_forecast: DailyForecast[];
}

const App: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [currentDateTime, setCurrentDateTime] = useState<string>('');

    // Función para obtener y actualizar la fecha y hora actuales
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDateTime = now.toLocaleString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
            setCurrentDateTime(formattedDateTime);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 60000); // Actualiza cada minuto
        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:5000/weather/${city}`);
            if (response.ok) {
                const data = await response.json();
                setWeatherData(data);
            } else {
                setError('No se pudo obtener el clima. Verifique la ciudad.');
                setWeatherData(null);
            }
        } catch (err) {
            setError('Hubo un error al hacer la petición');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="App p-8">
            <h1 className="text-xl font-bold mb-4">Consulta el Clima</h1>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe el nombre de una ciudad"
                className="p-2 border rounded mb-4"
            />
            <button
                onClick={handleSearch}
                className="p-2 bg-blue-500 text-white rounded"
                disabled={loading}
            >
                {loading ? 'Buscando...' : 'Buscar'}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {weatherData && (
                <div className="mt-4">
                    {/* Nombre de la ciudad y fecha/hora */}
                    <div className="flex flex-col items-start">
                        <h2 className="text-2xl font-semibold">{weatherData.city}</h2>
                        <p className="text-gray-600">{currentDateTime}</p>
                    </div>

                    {/* Clima Actual */}
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Clima Actual</h3>
                        <table className="table-auto w-full mt-2 border-collapse border border-gray-200">
                            <tbody>
                                <tr>
                                    <td className="border p-2">Temperatura</td>
                                    <td className="border p-2">{weatherData.current_weather.temperature}°C</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Amanecer</td>
                                    <td className="border p-2">{weatherData.current_weather.sunrise}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Atardecer</td>
                                    <td className="border p-2">{weatherData.current_weather.sunset}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Viento</td>
                                    <td className="border p-2">{weatherData.current_weather.wind_speed} m/s</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Humedad</td>
                                    <td className="border p-2">{weatherData.current_weather.humidity}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Predicción por horas */}
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Predicción por horas</h3>
                        <table className="table-auto w-full mt-2 border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border p-2">Hora</th>
                                    <th className="border p-2">Temperatura</th>
                                    <th className="border p-2">Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weatherData.hourly_forecast.map((hour, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{hour.time}</td>
                                        <td className="border p-2">{hour.temperature}°C</td>
                                        <td className="border p-2">{hour.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Predicción para los próximos 5 días */}
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Predicción de los Próximos 5 Días</h3>
                        <table className="table-auto w-full mt-2 border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border p-2">Fecha</th>
                                    <th className="border p-2">Máxima</th>
                                    <th className="border p-2">Mínima</th>
                                    <th className="border p-2">Descripción</th>
                                    <th className="border p-2">Icono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weatherData.daily_forecast.map((day, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">{day.date}</td>
                                        <td className="border p-2">{day.temperature_max}°C</td>
                                        <td className="border p-2">{day.temperature_min}°C</td>
                                        <td className="border p-2">{day.description}</td>
                                        <td className="border p-2">
                                            <img
                                                src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                                alt={day.description}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

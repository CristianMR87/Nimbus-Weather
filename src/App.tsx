import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
            const formattedDateTime = now.toLocaleString('en-EN', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
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
        <div className="App p-5 mt-5 mx-96 table-auto border-collapse border border-gray-200 rounded-xl bg-gradient-to-b from-[#4b6d8c] via-[#6f8fa6] to-[#b0c5d1] shadow-xl">
            <div className="flex justify-center items-center mb-4">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Search City or Zip Code"
                        className="p-2 border rounded pl-10 pr-16 w-full shadow-xl"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 p-1 text-2xl"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <FontAwesomeIcon icon={faSearch} />
                        )}
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="flex flex-col items-center mt-4">
                <h1 className="text-3xl font-bold">{weatherData?.city}</h1>
                <p className="text-black">{currentDateTime}</p>
            </div>

            {weatherData && (
                <div className="mt-4">
                    {/* Contenedor de la predicción actual y la predicción de los próximos 5 días */}
                    <div className="flex flex-col gap-4">
                        {/* Predicción actual */}
                        <div className="flex gap-4 mb-4">
                            {/* Contenedor para la predicción del día actual */}
                            <div className="flex flex-col w-1/2 h-[300px]"> {/* 50% de ancho y altura fija */}
                                <h3 className="text-xl font-bold mt-4">Clima Actual</h3>
                                <div className="mt-4 bg-gradient-to-b from-[#50626d] via-[#848fa7] to-[#c3cfd7] shadow-xl rounded-xl p-4 flex items-center justify-between h-full">
                                    <div className="flex flex-col items-start">
                                        <p className="text-4xl font-bold">{weatherData.current_weather.temperature}°C</p>
                                        <p className="text-lg ">💨 Viento: {weatherData.current_weather.wind_speed} m/s</p>
                                        <p className="text-lg">💧 Humedad: {weatherData.current_weather.humidity}%</p>
                                    </div>

                                    <div className="flex justify-center items-center">
                                        <img
                                            src={`http://openweathermap.org/img/wn/${weatherData.current_weather.icon}@4x.png`}
                                            alt="Icono del clima"
                                            className="w-24 h-24"
                                        />
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <p className="text-lg">🌅 Amanecer: {weatherData.current_weather.sunrise}</p>
                                        <p className="text-lg">🌇 Atardecer: {weatherData.current_weather.sunset}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Predicción por horas */}
                            <div className="w-1/2 h-[300px]">
                                <h3 className="text-xl font-bold">Predicción por horas</h3>
                                <div className="h-full flex">
                                    <table className="table-auto mt-2 border-collapse border-gray-200 bg-gradient-to-b from-[#50626d] via-[#848fa7] to-[#c3cfd7] shadow-xl rounded-xl w-full">
                                        <thead>
                                            <tr>
                                                <th className="border p-2 text-center text-xl">Hora</th>
                                                <th className="border p-2 text-center text-xl">Temperatura</th>
                                                <th className="border p-2 text-center text-xl">Descripción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {weatherData.hourly_forecast.map((hour, index) => (
                                                <tr key={index}>
                                                    <td className="border p-2 font-bold text-center">
                                                        {/* Formateamos la hora para que solo muestre horas y minutos */}
                                                        {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="border p-2 font-bold text-center">{hour.temperature}°C</td>
                                                    <td className="border p-2 font-bold text-center">{hour.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Predicción de los próximos 5 días debajo de la predicción actual */}
                        <div className="flex flex-col w-full">
                            <h3 className="text-xl font-bold mb-4">Predicción de los Próximos 5 Días</h3>
                            <table className="table-auto border-collapse border-gray-200 bg-gradient-to-b from-[#50626d] via-[#848fa7] to-[#acb7be] shadow-xl rounded-xl w-full">
                                <thead>
                                    <tr>
                                        <th colSpan={5} className="border p-2 font-bold text-2xl">5 day forecast:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weatherData.daily_forecast.map((day, index) => (
                                        <tr key={index}>
                                            <td className="border p-2 font-bold">{day.date}</td>
                                            <td className="border p-2 font-bold">{day.temperature_max}°C</td>
                                            <td className="border p-2 font-bold">{day.temperature_min}°C</td>
                                            <td className="border p-2 font-bold">{day.description}</td>
                                            <td className="border p-2">
                                                <img
                                                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                                    alt={day.description}
                                                    className="w-10 h-10"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

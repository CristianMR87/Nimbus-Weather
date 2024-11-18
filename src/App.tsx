import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Forecast {
    date: string;
    temperature: number;
    description: string;
    icon: string;
    rain_probability: number;  // Nueva propiedad
}

interface HourlyForecast {
    time: string;
    temperature: number;
    description: string;
    icon: string;
    rain_probability: number;  // Nueva propiedad
}

interface DailyForecast {
    date: string;
    temperature_max: number;
    temperature_min: number;
    icon: string;
    description: string;
    rain_probability: number;  // Nueva propiedad
}

interface CurrentWeather {
    temperature: number;
    sunrise: string;
    sunset: string;
    wind_speed: number;
    humidity: number;
    icon: string;
    rain_probability: number;  // Nueva propiedad
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
    const [searched, setSearched] = useState<boolean>(false); // Estado para verificar si se realizó la búsqueda

    // Función para actualizar la fecha y hora actual
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
        const interval = setInterval(updateDateTime, 60000); // Actualizar cada minuto
        return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setSearched(true); // Marcar como búsqueda realizada
        try {
            const response = await fetch(`http://localhost:5000/weather/${city}`);
            if (response.ok) {
                const data = await response.json();
                setWeatherData(data);
            } else {
                setError('Could not fetch weather. Please check the city.');
                setWeatherData(null);
            }
        } catch (err) {
            setError('There was an error making the request');
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

    // Función para obtener la ubicación actual
    const handleCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoading(true);
                    setError('');
                    setSearched(true); // Marcar como búsqueda realizada
                    try {
                        const response = await fetch(
                            `http://localhost:5000/weather?lat=${latitude}&lon=${longitude}`
                        );
                        if (response.ok) {
                            const data = await response.json();
                            setWeatherData(data);
                        } else {
                            setError('Could not fetch weather based on location.');
                            setWeatherData(null);
                        }
                    } catch (err) {
                        setError('There was an error making the request');
                        setWeatherData(null);
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    setError('Could not retrieve location. Please ensure geolocation is enabled.');
                }
            );
        } else {
            setError('Geolocation is not supported in this browser.');
        }
    };

    return (
        <div className="App p-5 mt-5 mx-96 table-auto border-collapse border border-gray-200 rounded-xl bg-gradient-to-b from-[#4b6d8c] via-[#6f8fa6] to-[#b0c5d1] shadow-xl relative">
            {/* Botón de ubicación en la esquina superior izquierda */}
            <button
                onClick={handleCurrentLocation}
                className="bg-gradient-to-b from-[#74b0ff] to-[#b0c5d1] p-2 rounded-full shadow-xl absolute top-4 left-4"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Current Location'}
            </button>

            <div className="flex justify-center items-center mb-4">
                <div className="flex w-full max-w-md gap-4"> {/* Añadido gap para separación */}
                    {/* Input de búsqueda sin cambios */}
                    <div className="relative w-full">
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
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 p-1"
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
            </div>

            {/* Mensaje si la ciudad está vacía y no se ha realizado la búsqueda */}
            {!searched && city === '' && !loading && (
                <div className="text-center">
                    <p className="text-black mt-4 text-center text-2xl font-bold">Welcome to Nimus Weather!</p>
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="flex flex-col items-center mt-4">
                <h1 className="text-2xl font-bold">{weatherData?.city}</h1>
                <p className="text-black">{currentDateTime}</p>
            </div>

            {weatherData && (
                <div className="mt-4">
                    <div className="flex flex-col gap-4">
                        {/* Clima actual */}
                        <div className="flex gap-4 mb-4">
                            <div className="flex flex-col w-1/2 h-[300px]">
                                <h3 className="text-xl font-bold mt-4">Current Weather</h3>
                                <div className="mt-4 bg-gradient-to-b from-[#50626d] via-[#848fa7] to-[#c3cfd7] shadow-xl rounded-xl p-4 flex items-center justify-between h-full">
                                    {/* Columna izquierda: Sunrise y Sunset */}
                                    <div className="flex flex-col items-start w-1/3">
                                        <p className="text-lg font-bold">🌅 Sunrise: {weatherData.current_weather.sunrise}</p>
                                        <p className="text-lg font-bold">🌇 Sunset: {weatherData.current_weather.sunset}</p>
                                    </div>

                                    {/* Columna central: Temperatura, icono*/}
                                    <div className="flex flex-col justify-center items-center w-1/3">
                                        <p className="text-4xl font-bold">{weatherData.current_weather.temperature}°C</p>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${weatherData.current_weather.icon}@4x.png`}
                                            alt="Weather Icon"
                                            className="w-24 h-24"
                                        />
                                    </div>

                                    {/* Columna derecha: Wind y Humidity */}
                                    <div className="flex flex-col items-end w-1/3">
                                        <p className="text-lg font-bold">💨 Wind: {(weatherData.current_weather.wind_speed * 3.6).toFixed(1)} km/h</p>
                                        <p className="text-lg font-bold">💧 Humidity: {weatherData.current_weather.humidity}%</p>
                                        <p className="text-lg font-bold">🌧️ {weatherData.current_weather.rain_probability}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pronóstico horario */}
                            <div className="w-1/2 h-[300px]">
                                <h3 className="text-xl font-bold">Hourly Forecast</h3>
                                <div className="h-full flex">
                                    <table className="table-auto mt-2 border-collapse border-gray-200 bg-gradient-to-b from-[#50626d] via-[#848fa7] to-[#c3cfd7] shadow-xl rounded-xl w-full">
                                        <thead>
                                            <tr>
                                                <th className="border p-2">Hour</th>
                                                <th className="border p-2">Temperature</th>
                                                <th className="border p-2">Description</th>
                                                <th className="border p-2 ">🌧️</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {weatherData.hourly_forecast.map((hour, index) => {
                                                const hourDate = new Date(hour.time);
                                                const formattedTime = hourDate.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                });

                                                return (
                                                    <tr key={index}>
                                                        <td className="border p-2 font-bold text-center">{formattedTime}</td>
                                                        <td className="border p-2 font-bold text-center">{hour.temperature}°C</td>
                                                        <td className="border p-2 text-center">
                                                            <img
                                                                src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                                                                alt={hour.description}
                                                                className="inline-block w-8 h-8"
                                                            />
                                                            {hour.description}
                                                        </td>
                                                        <td className="border p-2 text-center font-bold">{hour.rain_probability}%</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Pronóstico de los próximos 5 días */}
                        <h3 className="text-xl font-bold">Next 5 Days Forecast</h3>
                        <div className="flex gap-4 mt-4">
                            {weatherData.daily_forecast.map((day, index) => (
                                <div key={index} className="bg-gradient-to-b from-[#50626d] via-[#848fa7] to-[#c3cfd7] shadow-xl rounded-xl w-1/5 p-4 text-center">
                                    <p className="font-bold">{day.date}</p>
                                    <img
                                        src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                        alt={day.description}
                                        className="w-16 h-16 mx-auto"
                                    />
                                    <p className="font-bold">{day.temperature_max}°C / {day.temperature_min}°C</p>
                                    <p>{day.description}</p>
                                    <p className="font-bold">🌧️: {day.rain_probability}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

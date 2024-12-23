import React, { useState, useEffect } from 'react';

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
            const response = await fetch(`https://nimbus-weather-qt7w.onrender.com/weather/${city}`);
            if (response.ok) {
                const data = await response.json();
                setWeatherData(data);
            } else {
                setError('You must enter a city or Zip code.');
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
                        const response = await fetch(`https://nimbus-weather-qt7w.onrender.com/weather?lat=${latitude}&lon=${longitude}`);
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
        <div className="App p-5 mt-5 mx-auto max-w-screen-lg table-auto border-collapse border border-gray-200 rounded-xl bg-gradient-to-b from-[#3a7bd5] via-[#00d2ff] to-[#1eaeff] shadow-2xl relative">
            {/* Botón de ubicación en la esquina superior izquierda */}
            <button
                onClick={handleCurrentLocation}
                className={`bg-gradient-to-b from-[#f5f9fc] via-[#5cb7d5] to-[#ffb04b] font-bold p-2 rounded-full shadow-2xl z-10
                    flex items-center gap-2 sm:w-auto  sm:mb-0 mb-2 hover:scale-110 transition-all duration-200`}
                disabled={loading}
            >
                {loading ? (
                    <span className="animate-spin w-6 h-6 inline-block">
                        {/* Imagen con animación */}
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/10484/10484158.png" // URL de la imagen de carga
                        alt="Loading"
                        className="w-6 h-6"
                        />
                    </span>) : (
                    <>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/0/619.png"
                            alt="Current Location"
                            className="w-6 h-6"
                        />
                        <span>Current Location</span>
                    </>
                )}
                
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
                            className="p-2 border rounded pl-10 text-black font-bold pr-16 w-full shadow-2xl"
                        />
                        <button
                            onClick={handleSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 p-1 hover:text-blue-500 hover:scale-110 transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-spin w-6 h-6 inline-block">
                                    {/* Imagen con animación */}
                                    <img 
                                        src="https://cdn-icons-png.flaticon.com/512/10484/10484158.png" // URL de la imagen de carga
                                    alt="Loading"
                                    className="w-6 h-6"
                                    />
                                </span>) : (
                                <>
                                <img
                                    src="https://e7.pngegg.com/pngimages/342/516/png-clipart-computer-icons-search-icon-zooming-user-interface-computer-icons-thumbnail.png"
                                    alt="Search"
                                    className="w-6 h-6"
                                />
                            </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mensaje si la ciudad está vacía y no se ha realizado la búsqueda */}
            {!searched && city === '' && !loading && (
                <div className="text-center">
                    <p className="text-black mt-4 text-center text-2xl font-bold">Welcome to Nimbus Weather!</p>
                </div>
            )}

            {error && <p className="text-red-500 font-bold text-center mt-4">{error}</p>}

            <div className="flex flex-col items-center mt-4">
                <h1 className="text-2xl font-bold">{weatherData?.city}</h1>
                <p className="text-black">{currentDateTime}</p>
            </div>

            {weatherData && (
                <div className="mt-12">
                    <div className="flex flex-col gap-4">
                        {/* Clima actual */}
                        <div className="flex flex-col sm:flex-row justify-center items-center mb-4 gap-4 ">
                            <div className="w-full sm:w-1/2 h-auto sm:h-[292px] -mt-12">
                                <h3 className="text-lg sm:text-xl font-bold mt-4">Current Weather</h3>
                                <div className="mt-4 bg-gradient-to-b from-[#f5f9fc] via-[#5cb7d5] to-[#ffb04b] shadow-2xl rounded-xl p-4 flex flex-wrap sm:flex-nowrap items-center justify-between h-full hover:scale-105 transition-all duration-200">
                                    {/* Columna izquierda: Sunrise y Sunset */}
                                    <div className="flex flex-col items-start w-1/3">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src="https://icons.iconarchive.com/icons/iconsmind/outline/512/Sunrise-icon.png"
                                                alt="Sunrise"
                                                className="w-6 h-6"
                                            />
                                            <p className="text-lg font-bold">{weatherData.current_weather.sunrise}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/287/287668.png"
                                                alt="Sunset"
                                                className="w-6 h-6"
                                            />
                                            <p className="text-lg font-bold">{weatherData.current_weather.sunset}</p>
                                        </div>
                                    </div>

                                    {/* Columna central: Temperatura, icono */}
                                    <div className="flex flex-col justify-center items-center w-1/3">
                                        <p className="text-4xl font-bold">{weatherData.current_weather.temperature}°C</p>
                                        
                                        {/* Icono del clima */}
                                        <img
                                            src={`http://openweathermap.org/img/wn/${weatherData.current_weather.icon}@4x.png`}
                                            alt="Weather Icon"
                                            className="w-24 h-24"
                                        />

                                        {/* Mostrar temperaturas máximas y mínimas si están disponibles */}
                                        {weatherData.daily_forecast && weatherData.daily_forecast.length > 0 && (
                                            <p className="font-bold">
                                                {weatherData.daily_forecast[0].temperature_max}°C / {weatherData.daily_forecast[0].temperature_min}°C
                                            </p>
                                        )}
                                    </div>

                                    {/* Columna derecha: Wind y Humidity */}
                                    <div className="flex flex-col items-end w-1/3"> {/* items-end mantiene los elementos alineados a la derecha */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/219/219816.png"
                                                alt="Humidity"
                                                className="w-5 h-5"
                                            />
                                            <p className="font-bold">: {weatherData.current_weather.humidity}%</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/116/116251.png"
                                                alt="Rain"
                                                className="w-5 h-5"
                                            />
                                            <p className="font-bold">: {weatherData.current_weather.rain_probability}%</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/2011/2011448.png"
                                                alt="Wind"
                                                className="w-5 h-5"
                                            />
                                            <p className="font-bold">: {(weatherData.current_weather.wind_speed).toFixed(1)}km/h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pronóstico horario */}
                            <div className="w-full sm:w-1/2 h-auto sm:h-[300px] mt-2">
                                <h3 className="text-xl font-bold">Hourly Forecast</h3>
                                <div className="h-full flex">
                                    <table className="table-auto mt-2 border-collapse border-gray-200 bg-gradient-to-b from-[#f5f9fc] via-[#5cb7d5] to-[#ffb04b] shadow-2xl rounded-xl w-full hover:scale-105 transition-all duration-200">
                                        <thead>
                                            <tr>
                                                <th className="border p-2">Hour</th>
                                                <th className="border p-2">Temperature</th>
                                                <th className="border p-2 w-14">Sky</th>
                                                <th className="border p-2">🌧️</th>
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
                                                        <td className="border p-2 font-boldtext-center ">
                                                            <img
                                                                src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                                                                alt={hour.description}
                                                                className="ml-2 inline-block w-8 h-8"
                                                            />
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
                        <h3 className="text-xl text-center font-bold mt-5 ">Next 5 Days Forecast</h3>
                    <div className="min-w-[300px] max-w-full h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {weatherData.daily_forecast.map((day, index) => (
                            <div key={index} className="bg-gradient-to-b from-[#f5f9fc] via-[#5cb7d5] to-[#ffb04b] shadow-2xl rounded-xl p-4 text-center hover:scale-110 transition-all duration-200">
                                <p className="font-bold">
                                    {new Date(day.date).toLocaleDateString('en-EN', { weekday: 'short', day: 'numeric', month: 'short' })}
                                </p>
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

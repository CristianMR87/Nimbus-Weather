import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Interfaces (definiciones de tipos)
interface Forecast {
    date: string;
    temperature: number;
    description: string;
    icon: string;
    rain_probability: number;
}

interface HourlyForecast {
    time: string;
    temperature: number;
    description: string;
    icon: string;
    rain_probability: number;
}

interface DailyForecast {
    date: string;
    temperature_max: number;
    temperature_min: number;
    icon: string;
    description: string;
    rain_probability: number;
}

interface CurrentWeather {
    temperature: number;
    sunrise: string;
    sunset: string;
    wind_speed: number;
    humidity: number;
    icon: string;
    rain_probability: number;
}

interface WeatherData {
    city: string;
    current_weather: CurrentWeather;
    forecast: Forecast | null;
    hourly_forecast: HourlyForecast[];
    daily_forecast: DailyForecast[];
}

// Constantes para URLs de iconos
const ICON_URLS = {
    sunrise: 'https://cdn-icons-png.flaticon.com/512/8098/8098355.png',
    sunset: 'https://cdn-icons-png.flaticon.com/512/3236/3236899.png',
    humidity: 'https://static.vecteezy.com/system/resources/thumbnails/011/652/634/small_2x/humidity-3d-render-icon-illustration-png.png',
    rain: 'https://cdn-icons-png.flaticon.com/512/9443/9443086.png',
    wind: 'https://cdn-icons-png.freepik.com/512/10461/10461595.png',
    loading: 'https://cdn-icons-png.flaticon.com/512/10484/10484158.png',
    search: 'https://e7.pngegg.com/pngimages/342/516/png-clipart-computer-icons-search-icon-zooming-user-interface-computer-icons-thumbnail.png',
    location: 'https://cdn-icons-png.flaticon.com/512/10831/10831906.png',
};

const App: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [currentDateTime, setCurrentDateTime] = useState<string>('');

    const updateDateTime = useCallback(() => {
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
    }, []);

    useEffect(() => {
        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, [updateDateTime]);

    const handleSearch = async () => {
        setLoading(true);
        setError('');
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

    const handleCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoading(true);
                    setError('');
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

    const currentWeather = useMemo(() => weatherData?.current_weather, [weatherData]);
    const hourlyForecast = useMemo(() => weatherData?.hourly_forecast, [weatherData]);
    const dailyForecast = useMemo(() => weatherData?.daily_forecast, [weatherData]);

    return (
        <div className="App p-5 mt-5 mx-auto max-w-screen-lg table-auto border-collapse border border-gray-200 rounded-xl shadow-2xl relative"
            style={{
            backgroundImage: 'url(/images/Fondo.jpg)', // Ruta de la imagen en la carpeta public
            backgroundSize: 'cover',                       // La imagen cubrirá todo el contenedor
            backgroundPosition: 'center',                  // La imagen estará centrada
            }}>
            <button
                onClick={handleCurrentLocation}
                className={`font-bold p-2 rounded-full shadow-2xl z-10 flex items-center gap-2 sm:w-auto  sm:mb-0 mb-2 hover:scale-110 transition-all duration-200`}
                style={{
                    background: 'rgba(50, 50, 50, 0.8)', // Fondo blanco semi-transparente
                }}
                disabled={loading}
            >
                {loading ? (
                    <span className="animate-spin w-6 h-6 inline-block">
                        <img src={ICON_URLS.loading} alt="Loading" className="w-6 h-6" />
                    </span>
                ) : (
                    <>
                        <img src={ICON_URLS.location} alt="Current Location" className="w-6 h-6" />
                        <span>Current Location</span>
                    </>
                )}
            </button>

            <div className="flex justify-center items-center mb-4">
                <div className="flex w-full max-w-md gap-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Search City or Zip Code"
                            className="p-1 border rounded pl-10 text-black font-bold pr-10 w-full shadow-2xl"
                            style={{
                                background: 'rgba(255, 255, 255, 1)', // Fondo blanco semi-transparente
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 p-1 hover:text-blue-500 hover:scale-110 transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-spin w-6 h-6 inline-block">
                                    <img src={ICON_URLS.loading} alt="Loading" className="w-6 h-6" />
                                </span>
                            ) : (
                                <img src={ICON_URLS.search} alt="Search" className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {!weatherData && city === '' && !loading && (
                <div className="text-center">
                    <p className=" mt-4 text-center text-2xl font-bold">Welcome to Nimbus Weather!</p>
                </div>
            )}

            {error && <p className="text-red-500 font-bold text-center mt-4">{error}</p>}

            <div className="flex flex-col items-center mt-4">
                <h1 className="text-2xl font-bold">{weatherData?.city}</h1>
                <p className="">{currentDateTime}</p>
            </div>

            {weatherData && (
                <div className="mt-12">
                    {/* Current Weather y Hourly Forecast en la misma fila */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-1/2">
                            <CurrentWeatherSection currentWeather={currentWeather} dailyForecast={dailyForecast} />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <HourlyForecastSection hourlyForecast={hourlyForecast} />
                        </div>
                    </div>

                    {/* Daily Forecast en una fila separada */}
                    <div className="mt-8">
                        <DailyForecastSection dailyForecast={dailyForecast} />
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para mostrar el clima actual
const CurrentWeatherSection: React.FC<{ currentWeather: CurrentWeather | undefined, dailyForecast: DailyForecast[] | undefined }> = ({ currentWeather, dailyForecast }) => {
    if (!currentWeather) return null;

    return (
        <div className="w-full max-w-md flex flex-col">
            <h3 className="text-xl font-bold">Current Weather</h3>
            <div className="mt-1 shadow-2xl rounded-xl p-4 flex flex-col sm:flex-row items-center border border-gray-500 justify-between h-full hover:scale-105 transition-all duration-200"
                style={{
                    background: 'rgba(255, 255, 255, 0.1)', // Fondo blanco semi-transparente
                }}>
                {/* Left Column: Sunrise and Sunset */}
                <div className="flex flex-col items-start w-full sm:w-1/3 mb-4 sm:mb-0">
                    <div className="flex items-center gap-2">
                        <img src={ICON_URLS.sunrise} alt="Sunrise" className="w-6 h-6" />
                        <p className="text-lg font-bold">{currentWeather.sunrise}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <img src={ICON_URLS.sunset} alt="Sunset" className="w-6 h-6" />
                        <p className="text-lg font-bold">{currentWeather.sunset}</p>
                    </div>
                </div>

                {/* Middle Column: Temperature, Icon */}
                <div className="flex flex-col justify-center items-center w-full sm:w-1/3 mb-4 sm:mb-0">
                    <p className="text-4xl font-bold">{currentWeather.temperature}°C</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                        alt="Weather Icon"
                        className="w-24 h-24"
                    />
                    {dailyForecast && dailyForecast.length > 0 && (
                        <p className="font-bold">
                            {dailyForecast[0].temperature_max}°C / {dailyForecast[0].temperature_min}°C
                        </p>
                    )}
                </div>

                {/* Right Column: Wind and Humidity */}
                <div className="flex flex-col items-end w-full sm:w-1/3">
                    <div className="flex items-center gap-2 mt-2">
                        <img src={ICON_URLS.humidity} alt="Humidity" className="w-5 h-5" />
                        <p className="font-bold">: {currentWeather.humidity}%</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <img src={ICON_URLS.rain} alt="Rain" className="w-8 h-8" />
                        <p className="font-bold">: {currentWeather.rain_probability}%</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <img src={ICON_URLS.wind} alt="Wind" className="w-6 h-6" />
                        <p className="font-bold">: {currentWeather.wind_speed.toFixed(1)}km/h</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente para mostrar el pronóstico por horas
const HourlyForecastSection: React.FC<{ hourlyForecast: HourlyForecast[] | undefined }> = ({ hourlyForecast }) => {
    if (!hourlyForecast) return null;

    return (
        <div className="w-full flex flex-col h-full">
            <h3 className="text-xl font-bold "
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Hourly Forecast</h3>
            <div className="h-full flex">
                <table className="mt-1 shadow-2xl rounded-xl border flex flex-col justify-evenly border-gray-500 w-full hover:scale-105 transition-all duration-200"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)'
                    }}>
                    <thead>
                        <tr className="flex justify-between">
                            <th className="border p-2 flex-1 text-center">Hour</th>
                            <th className="border p-2 flex-1 text-center">Temperature</th>
                            <th className="border p-2 flex-1 text-center">Sky</th>
                            <th className="border p-2 flex-1 text-center"><img src={ICON_URLS.rain} alt="Rain" className="w-8 h-8 inline-block mr-2"/></th>
                        </tr>
                    </thead>
                    <tbody className="flex flex-col justify-evenly flex-grow">
                        {hourlyForecast.map((hour, index) => {
                            const hourDate = new Date(hour.time);
                            const formattedTime = hourDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
    
                            return (
                                <tr key={index} className="flex justify-between items-center">
                                    <td className="border p-2 flex-1 text-center">{formattedTime}</td>
                                    <td className="border p-2 flex-1 text-center">{hour.temperature}°C</td>
                                    <td className="border p-2 flex-1 text-center">
                                        <img
                                            src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                                            alt={hour.description}
                                            className="inline-block w-8 h-8"
                                        />
                                    </td>
                                    <td className="border p-2 font-bold flex-1 w-8 h-8text-center">{hour.rain_probability}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Componente para mostrar el pronóstico de los próximos días
const DailyForecastSection: React.FC<{ dailyForecast: DailyForecast[] | undefined }> = ({ dailyForecast }) => {
    if (!dailyForecast) return null;

    return (
        <>
            <h3 className="text-xl text-center  font-bold mt-5">Next 5 Days Forecast</h3>
            <div className="min-w-[300px] mt-1 max-w-full h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {dailyForecast.map((day, index) => (
                    <div key={index} className="shadow-2xl border border-gray-400 rounded-xl p-4 text-center hover:scale-110 transition-all duration-200"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)', // Fondo blanco semi-transparente
                    }}>
                        <p className="font-bold ">
                            {new Date(day.date).toLocaleDateString('en-EN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <img
                            src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                            alt={day.description}
                            className="w-16 h-16  mx-auto"
                        />
                        <p className="font-bold ">{day.temperature_max}°C / {day.temperature_min}°C</p>
                        <p className="font-light ">{day.description}</p>
                        <p className="font-bold "><img src={ICON_URLS.rain} alt="Rain" className="w-7 h-7 inline-block mr-2"/>{day.rain_probability}%</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default App;
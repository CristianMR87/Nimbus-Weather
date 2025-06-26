import React, { useState, useEffect, useMemo, useCallback } from 'react';
import LocationButton from './components/LocationButton';
import SearchBar from './components//SearchBar';
import CurrentWeatherSection from './components//CurrentWeatherSection';
import HourlyForecastSection from './components//HourlyForecastSection';
import DailyForecastSection from './components//DailyForecastSection';
import { WeatherData } from './types//weather';
import { fetchWeatherByCity, fetchWeatherByLocation } from './services//weatherService';
import { ICON_URLS } from './constants//icons';

const App: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [currentDateTime, setCurrentDateTime] = useState<string>('');
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);

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
        setSearchLoading(true);
        setError('');
        setLocationLoading(false);

        try {
            const data = await fetchWeatherByCity(city);
            setWeatherData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'There was an error making the request');
        } finally {
            setSearchLoading(false);
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCurrentLocation = async () => {
        setCity('');
        setLocationLoading(true);
        setError('');
        setSearchLoading(false);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoading(true);
                    try {
                        const data = await fetchWeatherByLocation(latitude, longitude);
                        setWeatherData(data);
                    } catch (err) {
                        setError(err instanceof Error ? err.message : 'There was an error making the request');
                    } finally {
                        setLocationLoading(false);
                        setLoading(false);
                    }
                },
                () => {
                    setError('Could not retrieve location. Please ensure geolocation is enabled.');
                    setLocationLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported in this browser.');
            setLocationLoading(false);
        }
    };

    const currentWeather = useMemo(() => weatherData?.current_weather, [weatherData]);
    const hourlyForecast = useMemo(() => weatherData?.hourly_forecast, [weatherData]);
    const dailyForecast = useMemo(() => weatherData?.daily_forecast, [weatherData]);

    return (
        <div className="flex justify-center items-start min-h-screen">
            <div className="App p-5 mt-1 mb-1 ml-1 mr-1 sm:w-full min-w-[330px] max-w-screen-lg border-collapse rounded-xl shadow-2xl relative"
                style={{
                    backgroundImage: 'url(/images/Fondo.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                <LocationButton
                    handleCurrentLocation={handleCurrentLocation}
                    locationLoading={locationLoading}
                    ICON_URLS={ICON_URLS}
                />

                <SearchBar
                    city={city}
                    setCity={setCity}
                    handleSearch={handleSearch}
                    handleKeyPress={handleKeyPress}
                    searchLoading={searchLoading}
                    ICON_URLS={ICON_URLS}
                />

                {!weatherData && city === '' && !loading && (
                    <div className="text-center">
                        <p className="mt-4 text-center text-2xl font-bold">Welcome to Nimbus Weather!</p>
                    </div>
                )}

                {error && <p className="text-red-500 font-bold text-center mt-4">{error}</p>}

                <div className="flex flex-col items-center mt-4">
                    <h1 className="text-2xl font-bold">{weatherData?.city}</h1>
                    <p className="">{currentDateTime}</p>
                </div>

                {weatherData && (
                    <div className="mt-12">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-1/2">
                                <CurrentWeatherSection
                                    currentWeather={currentWeather}
                                    dailyForecast={dailyForecast}
                                    ICON_URLS={ICON_URLS}
                                />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <HourlyForecastSection
                                    hourlyForecast={hourlyForecast}
                                    ICON_URLS={ICON_URLS}
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <DailyForecastSection
                                dailyForecast={dailyForecast}
                                ICON_URLS={ICON_URLS}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
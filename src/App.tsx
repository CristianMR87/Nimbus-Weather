import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const App: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<any | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [currentDateTime, setCurrentDateTime] = useState<string>('');
    const [searched, setSearched] = useState<boolean>(false);

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
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setSearched(true);
        try {
            const response = await fetch(`https://nimbus-weather-qt7w.onrender.com/weather/${city}`);
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

    const handleCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoading(true);
                    setError('');
                    setSearched(true);
                    try {
                        const response = await fetch(
                            `https://nimbus-weather-qt7w.onrender.com/weather?lat=${latitude}&lon=${longitude}`
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
        <div className="App p-5 mt-5 mx-auto max-w-screen-lg table-auto border-collapse border border-gray-200 rounded-xl bg-gradient-to-b from-[#75c3db] via-[#44a8a0] to-[#298a46] shadow-xl relative">
            <button
                onClick={handleCurrentLocation}
                className="bg-gradient-to-b from-[#74b0ff] to-[#b0c5d1] p-2 rounded-full shadow-xl absolute top-4 left-4"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Current Location'}
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
                            className="p-2 border rounded pl-10 text-black pr-16 w-full shadow-xl"
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

            {!searched && city === '' && !loading && (
                <div className="text-center">
                    <p className="text-black mt-4 text-center text-2xl font-bold">Welcome to Nimbus Weather!</p>
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="flex flex-col items-center mt-4">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{weatherData?.city}</h1>
                <p className="text-black">{currentDateTime}</p>
            </div>

            {weatherData && (
                <div className="mt-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col w-full lg:w-1/2 h-[300px]">
                            <h3 className="text-xl font-bold mt-4">Current Weather</h3>
                            {/* Clima actual */}
                        </div>
                        <div className="w-full lg:w-1/2 h-[300px]">
                            <h3 className="text-xl font-bold">Hourly Forecast</h3>
                            <div className="overflow-auto">
                                <table className="table-auto mt-2 border-collapse border-gray-200 bg-gradient-to-b from-[#66a8bd] via-[#80c0b5] to-[#b1eed5] shadow-xl rounded-xl w-full">
                                    {/* Tabla del pronóstico */}
                                </table>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mt-4">Next 5 Days Forecast</h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {weatherData.daily_forecast.map((day: any, index: number) => (
                            <div key={index} className="bg-gradient-to-b from-[#66a8bd] via-[#80c0b5] to-[#b1eed5] shadow-xl rounded-xl w-full sm:w-1/2 lg:w-1/5 p-4 text-center">
                                {/* Pronóstico diario */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

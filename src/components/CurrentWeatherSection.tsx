import React from 'react';

interface CurrentWeather {
    temperature: number;
    sunrise: string;
    sunset: string;
    wind_speed: number;
    humidity: number;
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

interface CurrentWeatherSectionProps {
    currentWeather: CurrentWeather | undefined;
    dailyForecast: DailyForecast[] | undefined;
    ICON_URLS: {
        sunrise: string;
        sunset: string;
        humidity: string;
        rain: string;
        wind: string;
    };
}

const CurrentWeatherSection: React.FC<CurrentWeatherSectionProps> = ({ currentWeather, dailyForecast, ICON_URLS }) => {
    if (!currentWeather) return null;

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-xl font-bold">Current Weather</h3>
            <div className="mt-2 shadow-2xl rounded-xl p-4 flex flex-col sm:flex-row items-center border border-gray-500 justify-between h-full hover:scale-105 transition-transform duration-300 ease-in-out"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
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
                <div className="flex flex-col justify-center items-center w-full sm:w-1/3 sm:mb-0">
                    <p className="text-4xl font-bold">{currentWeather.temperature}°C</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                        alt="Weather Icon"
                        className="w-26 h-26"
                    />
                    {dailyForecast && dailyForecast.length > 0 && (
                        <p className="font-bold">
                            {dailyForecast[0].temperature_max}°C / {dailyForecast[0].temperature_min}°C
                        </p>
                    )}
                </div>
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

export default CurrentWeatherSection;
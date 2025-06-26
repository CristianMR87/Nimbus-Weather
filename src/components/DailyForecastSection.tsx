import React from 'react';

interface DailyForecast {
    date: string;
    temperature_max: number;
    temperature_min: number;
    icon: string;
    description: string;
    rain_probability: number;
}

interface DailyForecastSectionProps {
    dailyForecast: DailyForecast[] | undefined;
    ICON_URLS: {
        rain: string;
    };
}

const DailyForecastSection: React.FC<DailyForecastSectionProps> = ({ dailyForecast, ICON_URLS }) => {
    if (!dailyForecast) return null;

    return (
        <>
            <h3 className="text-xl text-center font-bold mt-5">Next 5 Days Forecast</h3>
            <div className="min-w-[300px] mt-2 max-w-full h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {dailyForecast.map((day, index) => (
                    <div key={index} className="shadow-2xl border border-gray-400 rounded-xl p-4 text-center hover:scale-110 transition-transform duration-300 ease-in-out"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                        <p className="font-bold">
                            {new Date(day.date).toLocaleDateString('en-EN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <img
                            src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                            alt={day.description}
                            className="w-16 h-16 mx-auto"
                        />
                        <p className="font-bold">{day.temperature_max}°C / {day.temperature_min}°C</p>
                        <p className="font-light">{day.description}</p>
                        <p className="font-bold">
                            <img src={ICON_URLS.rain} alt="Rain" className="w-7 h-7 inline-block mr-2" />
                            {day.rain_probability}%
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default DailyForecastSection;
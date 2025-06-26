import React from 'react';

interface HourlyForecast {
    time: string;
    temperature: number;
    description: string;
    icon: string;
    rain_probability: number;
}

interface HourlyForecastSectionProps {
    hourlyForecast: HourlyForecast[] | undefined;
    ICON_URLS: {
        rain: string;
    };
}

const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({ hourlyForecast, ICON_URLS }) => {
    if (!hourlyForecast) return null;

    return (
        <div className="w-full flex flex-col h-full">
            <h3 className="text-xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Hourly Forecast
            </h3>
            <div className="h-full flex">
                <table
                    className="mt-2 shadow-2xl rounded-xl border flex flex-col justify-evenly border-gray-500 w-full hover:scale-105 transition-transform duration-300 ease-in-out"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                    <thead>
                        <tr className="flex justify-between">
                            <th className="border p-2 flex-1 text-center text-sm sm:text-base min-w-[80px]">Hour</th>
                            <th className="border p-2 flex-1 text-center text-sm sm:text-base min-w-[80px]">Temperature</th>
                            <th className="border p-2 flex-1 text-center text-sm sm:text-base min-w-[80px]">Sky</th>
                            <th className="border p-2 flex-1 text-center text-sm sm:text-base min-w-[80px]">
                                <img src={ICON_URLS.rain} alt="Rain" className="w-6 h-6 sm:w-8 sm:h-8 inline-block mr-2" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="flex flex-col justify-evenly flex-grow">
                        {hourlyForecast.map((hour, index) => {
                            const hourDate = new Date(hour.time);
                            const formattedTime = hourDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            });
    
                            return (
                                <tr key={index} className="flex justify-between items-center">
                                    <td className="border p-2 flex-1 text-center text-sm sm:text-base">{formattedTime}</td>
                                    <td className="border p-2 flex-1 text-center text-sm sm:text-base">
                                        {hour.temperature}°C
                                    </td>
                                    <td className="border p-2 flex-1 text-center">
                                        <img
                                            src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                                            alt={hour.description}
                                            className="inline-block w-6 h-6 sm:w-8 sm:h-8"
                                        />
                                    </td>
                                    <td className="border p-2 flex-1 text-center text-sm sm:text-base font-bold">
                                        {hour.rain_probability}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HourlyForecastSection;
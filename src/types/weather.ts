export interface Forecast {
    date: string;
    temperature: number;
    description: string;
    icon: string;
    rain_probability: number;
}

export interface HourlyForecast {
    time: string;
    temperature: number;
    description: string;
    icon: string;
    rain_probability: number;
}

export interface DailyForecast {
    date: string;
    temperature_max: number;
    temperature_min: number;
    icon: string;
    description: string;
    rain_probability: number;
}

export interface CurrentWeather {
    temperature: number;
    sunrise: string;
    sunset: string;
    wind_speed: number;
    humidity: number;
    icon: string;
    rain_probability: number;
}

export interface WeatherData {
    city: string;
    current_weather: CurrentWeather;
    forecast: Forecast | null;
    hourly_forecast: HourlyForecast[];
    daily_forecast: DailyForecast[];
}
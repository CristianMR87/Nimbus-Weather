import { WeatherData } from '../types/weather';

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
    const response = await fetch(`https://nimbus-weather-qt7w.onrender.com/weather/${city}`);
    if (!response.ok) {
        throw new Error('You must enter a city or Zip code.');
    }
    return await response.json();
};

export const fetchWeatherByLocation = async (latitude: number, longitude: number): Promise<WeatherData> => {
    const response = await fetch(`https://nimbus-weather-qt7w.onrender.com/weather?lat=${latitude}&lon=${longitude}`);
    if (!response.ok) {
        throw new Error('Could not fetch weather based on location.');
    }
    return await response.json();
};
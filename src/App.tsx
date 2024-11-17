import React, { useState } from 'react';

interface WeatherResponse {
	city: string;
	temperature: number;
	description: string;
	icon: string;
}

const App: React.FC = () => {
	const [city, setCity] = useState<string>('');
	const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const handleSearch = async () => {
    setLoading(true); 
    setError('');
    try {
		const response = await fetch(`http://localhost:5000/weather/${city}`);
		if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        setCity(''); 
		} else {
        setError('No se pudo obtener el clima. Verifique la ciudad.');
        setWeatherData(null);
		}
    } catch (err) {
		setError('Hubo un error al hacer la petición');
		setWeatherData(null);
    } finally {
      setLoading(false); 
    }
	};

	return (
    <div className="App p-8">
		<h1 className="text-xl font-bold mb-4">Consulta el Clima</h1>
		<input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Escribe el nombre de una ciudad"
        className="p-2 border rounded mb-4"
		/>
		<button
        onClick={handleSearch}
        className="p-2 bg-blue-500 text-white rounded"
        disabled={loading}
		>
        {loading ? 'Buscando...' : 'Buscar'}
		</button>

		{error && <p className="text-red-500 mt-4">{error}</p>}

		{weatherData && (
        <div className="mt-4">
			<h2 className="text-2xl font-semibold">{weatherData.city}</h2>
			<p className="capitalize">{weatherData.description}</p>
			<p>Temperatura: {weatherData.temperature}°C</p>
			<img
            src={`http://openweathermap.org/img/wn/${weatherData.icon}.png`}
            alt="Weather icon"
            className="mt-2"
			/>
        </div>
		)}
    </div>
	);
};

export default App;

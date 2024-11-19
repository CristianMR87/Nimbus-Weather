## English

Weather App

This is a web application for checking the weather forecast. It uses React with TypeScript on the frontend and Python with Flask on the backend to fetch weather data. The app is fully responsive, styled using Tailwind CSS.
Features

    Current weather and 5-day forecast.
    Uses the user's current location to display the forecast.
    Search functionality by city or zip code.
    Modern and responsive user interface.

Technologies
    Frontend

        React: JavaScript library for building user interfaces.
        TypeScript: A superset of JavaScript that adds static types to improve code quality.
        Tailwind CSS: Utility-first CSS framework for rapidly building responsive designs.

    Backend

        Python: Programming language for handling backend logic.
        Flask: Micro-framework for building web applications in Python.
        OpenWeather API: External API used to fetch weather data.

Installation

    Backend (Python + Flask)

        1.- Clone the repository: git clone https://github.com/your_username/your_repository.git

        2.- Navigate to the backend directory: cd backend

        3.- Create a virtual environment and activate it:
            python3 -m venv venv
            source venv/bin/activate  # On Windows, use venv\Scripts\activate

        4.- Install the dependencies: pip install -r requirements.txt

        5.- Set up environment variables for your OpenWeather API_KEY (you can do this in a .env file):
            OPENWEATHER_API_KEY=your_api_key

        6.-Start the Flask server: python app.py

        --> "The backend should be running at http://localhost:5000."

Frontend (React + Tailwind CSS)

        1.- Navigate to the root directory of the project.

        2.- Install the frontend dependencies: npm install

        3.- Start the development server: npm start

        --> "The frontend should be available at http://localhost:3000."


## Español

Aplicación de consulta del tiempo.

Este es un proyecto de aplicación web para consultar el pronóstico del tiempo. Utiliza React con TypeScript en el frontend y Python con Flask en el backend para la obtención de datos meteorológicos. La aplicación es completamente responsiva, utilizando Tailwind CSS para el diseño y estilos.
Características

    Consulta del pronóstico del tiempo actual y para los próximos 5 días.
    Utiliza la ubicación actual del usuario para mostrar el pronóstico.
    Función de búsqueda por ciudad o código postal.
    Interfaz de usuario moderna y responsiva.

Tecnologías
    Frontend

        React: Biblioteca de JavaScript para construir interfaces de usuario.
        TypeScript: Superset de JavaScript para añadir tipado estático y mejorar la calidad del código.
        Tailwind CSS: Framework de CSS para diseñar interfaces de manera rápida y responsiva.

    Backend

        Python: Lenguaje de programación para manejar la lógica del backend.
        Flask: Micro-framework para la creación de aplicaciones web en Python.
        OpenWeather API: API externa utilizada para obtener datos meteorológicos.


Instalación

    Backend (Python + Flask)
        1.- Clona el repositorio: git clone https://github.com/tu_usuario/tu_repositorio.git

        2.- Navega al directorio del backend: cd backend

        3.- Crea un entorno virtual y activa el entorno:
            python3 -m venv venv
            source venv/bin/activate  # En Windows usa venv\Scripts\activate
        
        4.- Instala las dependencias: pip install -r requirements.txt

        5.- Configura las variables de entorno para tu API_KEY de OpenWeather (puedes hacerlo en un archivo .env):
            OPENWEATHER_API_KEY=tu_api_key
        
        6.- Inicia el servidor Flask: python app.py

        --> "El backend debería estar corriendo en http://localhost:5000."

    Frontend (React + Tailwind CSS)

        1.- Navega al directorio principal del proyecto.

        2.- Instala las dependencias del frontend: npm install

        3.- Inicia el servidor de desarrollo: npm start

        --> "El frontend debería estar disponible en http://localhost:3000."

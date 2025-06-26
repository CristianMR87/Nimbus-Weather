import React from 'react';

interface SearchBarProps {
    city: string;
    setCity: (city: string) => void;
    handleSearch: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    searchLoading: boolean;
    ICON_URLS: {
        loading: string;
        search: string;
    };
}

const SearchBar: React.FC<SearchBarProps> = ({ city, setCity, handleSearch, handleKeyPress, searchLoading, ICON_URLS }) => {
    return (
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
                        style={{ background: 'rgba(255, 255, 255, 1)' }}
                    />
                    <button
                        onClick={handleSearch}
                        className="flex justify-center items-center absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 p-1 hover:text-blue-500 hover:scale-110 transition-transform duration-300 ease-in-out"
                        disabled={searchLoading}
                    >
                        {searchLoading ? (
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
    );
};

export default SearchBar;
import React from 'react';

interface LocationButtonProps {
    handleCurrentLocation: () => void;
    locationLoading: boolean;
    ICON_URLS: {
        loading: string;
        location: string;
    };
}

const LocationButton: React.FC<LocationButtonProps> = ({ handleCurrentLocation, locationLoading, ICON_URLS }) => {
    return (
        <button
            onClick={handleCurrentLocation}
            className={`font-bold p-1.5 text-sm rounded-full flex items-center gap-1.5 border border-gray-900 mb-2 hover:scale-110 transition-transform duration-300 ease-in-out`}
            style={{ background: 'rgba(50, 50, 50, 0.8)' }}
            disabled={locationLoading}
        >
            {locationLoading ? (
                <span className="animate-spin w-6 h-6 inline-block">
                    <img src={ICON_URLS.loading} alt="Loading" className="w-6 h-6" />
                </span>
            ) : (
                <>
                    <img src={ICON_URLS.location} alt="Current Location" className="w-6 h-6" />
                    <span>Current Location</span>
                </>
            )}
        </button>
    );
};

export default LocationButton;
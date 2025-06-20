import { useEffect, useState } from "react";

export function useGeoLocation() {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [locationError, setLocationEError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationEError("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                setLocationEError(err.message);
            }
        );
    }, []);

    return { location, locationError };
}
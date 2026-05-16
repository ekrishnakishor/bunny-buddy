import { useState, useEffect } from 'react';

export const useNearbyPlaces = (lat, lng, category) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lng || !category) {
      setPlaces([]);
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const osmTags = {
          'Police': 'amenity=police',
          'Hospitals': 'amenity=hospital',
          'Bus Stops': 'highway=bus_stop',
          'Malls': 'shop=mall',
          'Theatres': 'amenity=cinema'
        };

        const tag = osmTags[category];
        if (!tag) return;

        const query = `[out:json];nwr(around:3000,${lat},${lng})[${tag}];out center 15;`;
        
        // THE FIX: Using a POST request with headers bypasses the CORS and 406 errors
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `data=${encodeURIComponent(query)}`
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.elements) {
          setPlaces([]);
          return;
        }

        const formattedPlaces = data.elements
          .filter(el => el.tags && el.tags.name)
          .map(el => {
            const placeLat = el.lat || (el.center ? el.center.lat : null);
            const placeLng = el.lon || (el.center ? el.center.lng : null);

            return {
              name: el.tags.name,
              lat: placeLat,
              lng: placeLng,
              phone: el.tags.phone || el.tags['contact:phone'] || 'Not listed',
              bus: el.tags.highway === 'bus_stop' ? 'On-site Stop' : 'Nearby Route Connect'
            };
          })
          .filter(place => place.lat !== null && place.lng !== null);

        setPlaces(formattedPlaces);
      } catch (error) {
        console.error("Failed to fetch places from OpenStreetMap:", error);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [lat, lng, category]);

  return { places, loading };
};
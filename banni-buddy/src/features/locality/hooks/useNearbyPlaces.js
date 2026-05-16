import { useState, useEffect } from 'react';

export const useNearbyPlaces = (lat, lng, category) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only run the fetch if we have coordinates and a selected category
    if (!lat || !lng || !category) {
      setPlaces([]);
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        // Map our UI button names to OpenStreetMap specific tags
        const osmTags = {
          'Police': 'amenity=police',
          'Hospitals': 'amenity=hospital',
          'Bus Stops': 'highway=bus_stop',
          'Malls': 'shop=mall',
          'Theatres': 'amenity=cinema'
        };

        const tag = osmTags[category];
        if (!tag) return;

        // The Overpass Query: Look within 3000 meters (3km) of the lat/lng for the specific tag
        const query = `[out:json];node(around:3000,${lat},${lng})[${tag}];out 10;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        const response = await fetch(url);
        const data = await response.json();

        // Format the raw OpenStreetMap data into our clean UI format
        const formattedPlaces = data.elements
          .filter(el => el.tags && el.tags.name) // Only keep places that actually have a name listed
          .map(el => ({
            name: el.tags.name,
            lat: el.lat,
            lng: el.lon,
            phone: el.tags.phone || 'Not listed',
            bus: 'Check Maps for route' // OSM doesn't link bus stops to places easily, so we fallback
          }));

        setPlaces(formattedPlaces);
      } catch (error) {
        console.error("Failed to fetch places from OpenStreetMap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [lat, lng, category]);

  return { places, loading };
};
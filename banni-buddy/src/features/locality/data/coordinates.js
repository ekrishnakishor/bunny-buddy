export const LOCALITY_COORDINATES = {
  "BTM Layout": { lat: 12.9166, lng: 77.6101 },
  "HSR Layout": { lat: 12.9121, lng: 77.6446 },
  "Koramangala": { lat: 12.9352, lng: 77.6244 },
  "Indiranagar": { lat: 12.9719, lng: 77.6412 },
  "Jayanagar": { lat: 12.9307, lng: 77.5832 }
};

export const getDefaultCoordinates = (localityName) => {
  return LOCALITY_COORDINATES[localityName] || { lat: 12.9716, lng: 77.5946 };
};
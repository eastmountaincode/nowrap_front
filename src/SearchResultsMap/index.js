import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This is a solution to an issue with Leaflet's default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function SearchResultsMap({ results }) {
    const mapStyles = {
        width: "100%",
        height: "400px",
        margin: "0 auto"
    };

    // Extract the center from the first result or default to a hardcoded value.
    const center = results && results.length > 0
        ? results[0].location.coordinates.split(',').map(coord => parseFloat(coord.trim()))
        : [40.505, -100.09];

    // Create an object to track which stores have been added to the map
    const storesAdded = {};

    return (
        <div>
            <MapContainer center={center} zoom={13} style={mapStyles}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {results && results.map((ingredient, index) => {
                    const storeId = ingredient.store_id; // assuming each ingredient has a store_id field
                    const coordinates = ingredient.location.coordinates.split(',').map(coord => parseFloat(coord.trim()));

                    // Check if we have already added this store
                    if (storesAdded[storeId]) {
                        return null; // Skip this ingredient as the store is already represented on the map
                    }

                    // Mark this store as added
                    storesAdded[storeId] = true;

                    return (
                        <Marker
                            key={index}
                            position={coordinates}
                        >
                            <Popup>
                                <strong>{ingredient.ingredient_name}</strong><br />
                                <strong>Location:</strong> {ingredient.location.location_name}<br />
                                <strong>Address:</strong> {ingredient.location.address}, {ingredient.location.city}, {ingredient.location.state}, {ingredient.location.country}, {ingredient.location.postal_code}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}

export default SearchResultsMap;


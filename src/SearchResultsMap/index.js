import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

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
                {results && results.map((result, index) => {
                    const storeId = result.location._id; // assuming each ingredient has a store_id field
                    const coordinates = result.location.coordinates.split(',').map(coord => parseFloat(coord.trim()));

                    // Check if we have already added this store
                    if (storesAdded[storeId]) {
                        return null; // Skip this ingredient as the store is already represented on the map
                    }

                    // Mark this store as added
                    storesAdded[storeId] = true;
                    //console.log("result!!!!:", result);

                    return (
                        <Marker
                            key={index}
                            position={coordinates}
                        >
                            <Popup>
                                <strong>{result.ingredient_name ? result.ingredient_name : result.ingredient.ingredient_name}</strong><br />
                                <strong>Location:</strong> {result.location.location_name}<br />
                                <strong>Address:</strong> {result.location.address}, {result.location.city}, {result.location.state}, {result.location.country}, {result.location.postal_code}<br />
                                <Link to={`/details?identifier=${result._id ? result._id : result.ingredient._id}`}>View Details</Link>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}

export default SearchResultsMap;


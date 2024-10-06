// src/components/Maps/Map.tsx
"use client"
import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression, LatLngBoundsExpression, Layer } from 'leaflet';
import { Feature } from 'geojson';
import L from 'leaflet';
import "../../css/map.css"


const ALL_OF_CALIFORNIA: LatLngBoundsExpression = [
        [32.5343, -124.4096], // Southwest corner of California (approximate)
        [42.0095, -114.1312]  // Northeast corner of California (approximate)
];

const SAN_FRANCISCO: LatLngExpression = [37.7749, -122.4194]

const sfBusinesses: LatLngExpression[] = [
    [37.7577, -122.4269],
    [37.7774, -122.4009],
    [37.8057, -122.4104],
]

/** LONG - LAT **/
const sfDistricts = [
    {
        name: "Mission District",
        coordinates: [
            [-122.4269, 37.7577],
            [-122.4214, 37.7596],
            [-122.4228, 37.7637],
            [-122.4347, 37.7640],
            [-122.4364, 37.7595],
            [-122.4269, 37.7577], // Closing the polygon
        ]
    },
    {
        name: "SoMa (South of Market)",
        coordinates: [
            [-122.4009, 37.7774],
            [-122.3944, 37.7790],
            [-122.3949, 37.7824],
            [-122.4032, 37.7819],
            [-122.4018, 37.7800],
            [-122.4009, 37.7774], // Closing the polygon
        ]
    },
    {
        name: "North Beach",
        coordinates: [
            [-122.4130, 37.8031],
            [-122.4098, 37.8042],
            [-122.4104, 37.8057],
            [-122.4151, 37.8043],
            [-122.4130, 37.8031], // Closing the polygon
        ]
    },
    {
        name: "Chinatown",
        coordinates: [
            [-122.4075, 37.7942],
            [-122.4045, 37.7949],
            [-122.4060, 37.7966],
            [-122.4079, 37.7965],
            [-122.4075, 37.7942], // Closing the polygon
        ]
    },
    {
        name: "Tenderloin",
        coordinates: [
            [-122.4150, 37.7831],
            [-122.4140, 37.7840],
            [-122.4170, 37.7855],
            [-122.4182, 37.7838],
            [-122.4150, 37.7831], // Closing the polygon
        ]
    },
];


const sfFeatures = {
    "type": "FeatureCollection" as "FeatureCollection",
    "features": sfDistricts.map(district => ({
        "type": "Feature",
        "properties": {
            "name" : district.name
        },
        "geometry": {
            "type": "Polygon",  // Change to Polygon for each district
            "coordinates": [district.coordinates] // Wrap in an array for the correct structure
        }
    }))
}

const MapComponent: React.FC = () => {
    // Dark mode
    // 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

    const onEachFeature = (feature: Feature, layer: Layer) => {
        if (feature.properties && feature.properties.name) {
            // Bind the popup without opening it immediately
            layer.bindPopup(feature.properties.name);

            // Show the popup on mouseover
            layer.on('mouseover', () => {
                layer.openPopup();  // Open the popup
                layer.setStyle({
                    weight: 5,  // Increase weight to highlight the district
                    color: 'blue', // Change color on hover (optional)
                });
            });

            // Hide the popup on mouseout
            layer.on('mouseout', () => {
                layer.closePopup();  // Close the popup
                layer.setStyle({
                    weight: 2,  // Reset weight
                    color: 'white', // Reset color
                });
            });
        }
    };

    const makeDotIcon = (size: number) => {
        const randomNumber = Math.random() * size
        const dotIcon = L.divIcon({
            className: 'custom-dot-icon',
            iconSize: [randomNumber, randomNumber],
            popupAnchor: [0, -5]
        });

        return dotIcon;
    }


    return (
        <MapContainer
            center={SAN_FRANCISCO}
            zoom={9}
            minZoom={6}  // Minimum zoom level to see all of California
            maxZoom={20} // Set the maximum zoom-in level
            style={{ height: '100vh', width: '100%' }}
            maxBounds={ALL_OF_CALIFORNIA}
            >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                subdomains={['a', 'b', 'c', 'd']}
                maxZoom={20}
            />
            {sfBusinesses.map((biz, index) => {
                const n = makeDotIcon(25);
                return (<Marker
                            key={index}
                            riseOnHover={true}
                            position={biz} // Leaflet expects [lat, lng]
                            icon={n}
                        >
                            <Popup>"moo"</Popup>
                        </Marker>)
                }
            )}
            <GeoJSON
                data={sfFeatures}
                style={() => ({
                    fillColor: '#007BFF',
                    weight: 2,
                    color: '#000',        // Black border color
                    fillOpacity: 0.5
                })}
                onEachFeature={onEachFeature}
            />
        </MapContainer>
    );
};

export default MapComponent;

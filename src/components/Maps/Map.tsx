// src/components/Maps/Map.tsx
"use client"
import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression, LatLngBoundsExpression } from 'leaflet';


const ALL_OF_CALIFORNIA: LatLngBoundsExpression = [
        [32.5343, -124.4096], // Southwest corner of California (approximate)
        [42.0095, -114.1312]  // Northeast corner of California (approximate)
];

const SAN_FRANCISCO: LatLngExpression = [37.7749, -122.4194]

const sfDistricts: LatLngExpression[][] = [
    // Mission District
    [
        [37.7577, -122.4269],
        [37.7596, -122.4214],
        [37.7637, -122.4228],
        [37.7640, -122.4347],
        [37.7595, -122.4364],
        [37.7577, -122.4269], // Closing the polygon
    ],
    // SoMa (South of Market)
    [
        [37.7774, -122.4009],
        [37.7790, -122.3944],
        [37.7824, -122.3949],
        [37.7819, -122.4032],
        [37.7800, -122.4018],
        [37.7774, -122.4009], // Closing the polygon
    ],
    // North Beach
    [
        [37.8031, -122.4130],
        [37.8042, -122.4098],
        [37.8057, -122.4104],
        [37.8043, -122.4151],
        [37.8031, -122.4130], // Closing the polygon
    ],
    // Chinatown
    [
        [37.7942, -122.4075],
        [37.7949, -122.4045],
        [37.7966, -122.4060],
        [37.7965, -122.4079],
        [37.7942, -122.4075], // Closing the polygon
    ],
    // Tenderloin
    [
        [37.7831, -122.4150],
        [37.7840, -122.4140],
        [37.7855, -122.4170],
        [37.7838, -122.4182],
        [37.7831, -122.4150], // Closing the polygon
    ],
];

const MapComponent: React.FC = () => {
    // Dark mode
    // 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    return (
        <MapContainer
            center={SAN_FRANCISCO}
            zoom={9}
            minZoom={6}  // Minimum zoom level to see all of California
            maxZoom={12} // Set the maximum zoom-in level
            style={{ height: '100vh', width: '100%' }}
            maxBounds={ALL_OF_CALIFORNIA}
            >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                subdomains={['a', 'b', 'c', 'd']}
                maxZoom={20}
            />
            {sfDistricts.map((district, index) => (
                <Polygon key={index} positions={district} color="#3388ff" weight={3}>
                    <Popup>
                        District {index + 1}
                    </Popup>
                </Polygon>
            ))}
        </MapContainer>
    );
};

export default MapComponent;

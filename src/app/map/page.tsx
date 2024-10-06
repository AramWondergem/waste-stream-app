import React from 'react';
import MapComponent from '../../components/Maps/Map';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import "../../css/map.css"

const MapPage = () => {
    return (
        <DefaultLayout>
            <div className=".map-container">
                <h1>Business and County Locations</h1>
                    <MapComponent />
            </div>
        </DefaultLayout>
    );
};

export default MapPage;

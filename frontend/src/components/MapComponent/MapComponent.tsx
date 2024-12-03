import React, { useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, FeatureGroup } from 'react-leaflet';
// import { EditControl } from 'react-leaflet-draw';
import { LatLngTuple } from 'leaflet';
import { Tooltip } from 'react-leaflet';
import { FeatureCollection } from '../../types/geojson';
import coordinates from '../../config/geoConfig.json';
import L from 'leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { togglePolygonSelection } from '../../store/solutionsSlice';
import { AppDispatch, RootState } from '../../store/store';

interface MapComponentProps {
  selectedSolutions: FeatureCollection[];
  // onUpdate: (updatedFeatures: FeatureCollection[]) => void; // Callback to update features
  mapData: FeatureCollection | null; // Union result or custom data to display
  // onSelectionChange: (selectedIds: string[]) => void; // Callback for selected polygons
}

const AddZoomControls: React.FC = () => {
  const map = useMap();

  React.useEffect(() => {
    // Move zoom controls to the bottom-left corner
    map.zoomControl.setPosition('bottomleft');
  }, [map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  selectedSolutions,
  // onUpdate,
  mapData,
  // onSelectionChange,
}) => {
  const defaultCenter: LatLngTuple = coordinates.parisCentre as LatLngTuple;
  const featureGroupRef = useRef<L.FeatureGroup>(null); // Reference for the FeatureGroup
  const dispatch = useDispatch<AppDispatch>();
  const selectedPolygons = useSelector((state: RootState) => state.solutions.selectedPolygons);
  const [selectedPolygonIds, setSelectedPolygonIds] = useState<string[]>([]); // Track selected polygons

  const { polygons, initialCenter, polygonIds } = useMemo(() => {
    let polygons: LatLngTuple[][] = [];
    const polygonIds: string[] = [];
    let initialCenter: LatLngTuple = defaultCenter;

    const dataToRender = mapData || selectedSolutions;

    if (Array.isArray(dataToRender) && dataToRender.length > 0) {
      const firstPolygon = dataToRender[0].features[0].geometry.coordinates[0];

      // Calculate the initial center based on the first polygon
      const totalLat = firstPolygon.reduce((sum, coord) => sum + coord[1], 0); // Sum of latitudes
      const totalLng = firstPolygon.reduce((sum, coord) => sum + coord[0], 0); // Sum of longitudes
      initialCenter = [totalLat / firstPolygon.length, totalLng / firstPolygon.length] as LatLngTuple;

      // Convert all polygons to Leaflet-compatible LatLngTuple arrays and track IDs
      polygons = dataToRender.flatMap((solution) =>
        solution.features.map((feature) => {
          polygonIds.push(feature.id as string); // Store the feature ID
          return feature.geometry.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLngTuple);
        })
      );
    } else if (!Array.isArray(dataToRender) && dataToRender?.features?.length > 0) {
      // Handle the case where dataToRender is a single FeatureCollection
      const firstPolygon = dataToRender.features[0].geometry.coordinates[0];
      const totalLat = firstPolygon.reduce((sum, coord) => sum + coord[1], 0); // Sum of latitudes
      const totalLng = firstPolygon.reduce((sum, coord) => sum + coord[0], 0); // Sum of longitudes
      initialCenter = [totalLat / firstPolygon.length, totalLng / firstPolygon.length] as LatLngTuple;

      // Convert polygons to Leaflet-compatible LatLngTuple arrays
      polygons = dataToRender.features.map((feature) => {
        polygonIds.push(feature.id as string); // Store the feature ID
        return feature.geometry.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLngTuple);
      });
    }

    return { polygons, initialCenter, polygonIds };
  }, [selectedSolutions, mapData]);

  const handlePolygonClick = (polygonId: string) => {
    setSelectedPolygonIds((prevSelected) => {
      if (prevSelected.includes(polygonId)) {
        // If already selected, remove it (unselect)
        return prevSelected.filter((id) => id !== polygonId);
      } else {
        // Otherwise, add it (select)
        return [...prevSelected, polygonId];
      }
    });
    dispatch(togglePolygonSelection(polygonId)); // Dispatch action to update global state
  };

  return (
    <MapContainer
      center={initialCenter} // Set the center only on initialization
      zoom={13}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
       
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* FeatureGroup for editable layers */}
      <FeatureGroup ref={featureGroupRef} >
        {/* Existing polygons */}
        {polygons.map((polygon, index) => {
           const uniqueKey = polygonIds[index] || `polygon-${index}`;

           return(
          <Polygon
            key={uniqueKey} 
            positions={polygon}
            eventHandlers={{
              click: () => handlePolygonClick(polygonIds[index]),
            }}
            pathOptions={{
              color: selectedPolygons.includes(polygonIds[index]) ? '#1976d2' : 'black',
            }}
          >
            {/* Show Tooltip only if the polygon is selected */}
            {selectedPolygonIds.includes(polygonIds[index]) && (
              <Tooltip permanent>{`Polygon ID: ${polygonIds[index]}`}</Tooltip>
            )}
          </Polygon>
        );
      })}

        {/* Editing controls */}
        {/* <EditControl
          position="bottomright"
          onEdited={handleEdit} // Capture edits
          onCreated={handleCreate} // Handle new polygons
          draw={{
            polygon: true,
            rectangle: false,
            polyline: false,
            circle: false,
            marker: false,
          }}
          edit={{
            remove: true,
          }}
        /> */}
      </FeatureGroup>

      <AddZoomControls /> {/* Adjust zoom controls position */}

    </MapContainer>
  );
};

export default MapComponent;

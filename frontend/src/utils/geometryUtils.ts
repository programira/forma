import { Feature, Polygon, MultiPolygon, FeatureCollection } from 'geojson';
import { union, area, intersect } from '@turf/turf';

/**
 * Perform a union operation on selected polygons.
 * @param selectedPolygonFeatures - Array of selected polygon features
 * @returns Union result as a FeatureCollection and the total area
 */
export const performUnionUsingFeatureCollection = (
    selectedPolygonFeatures: Feature<Polygon>[]
  ): { unionResult: Feature<Polygon | MultiPolygon> | null; totalArea: number } => {
    if (selectedPolygonFeatures.length < 2) {
      console.error('Union operation requires at least two polygons.');
      return { unionResult: null, totalArea: 0 };
    }
  
    try {
      // Wrap the features in a FeatureCollection
      const featureCollection: FeatureCollection<Polygon> = {
        type: 'FeatureCollection',
        features: selectedPolygonFeatures,
      };
  
      // Perform union using the FeatureCollection
      const unionResult = union(featureCollection) as Feature<Polygon | MultiPolygon>;
  
      if (!unionResult) {
        console.error('Union operation failed.');
        return { unionResult: null, totalArea: 0 };
      }

          // Assign a unique ID to the resulting union feature
        const unionResultWithId: Feature<Polygon | MultiPolygon> = {
        ...unionResult,
        id: `union-${Date.now()}`, // Use a timestamp-based ID
        properties: {
          ...unionResult.properties,
          generatedBy: 'performUnion', // Optional metadata
        },
      };
  
      // Calculate total area
      const totalArea = area(unionResult);
  
      return { unionResult: unionResultWithId, totalArea };
    } catch (error) {
      console.error('Union operation error:', error);
      return { unionResult: null, totalArea: 0 };
    }
  };

  export const performIntersectUsingFeatureCollection = (
    selectedPolygonFeatures: Feature<Polygon>[]
  ): { intersectResult: Feature<Polygon | MultiPolygon> | null; totalArea: number } => {
    if (selectedPolygonFeatures.length < 2) {
      console.error('Union operation requires at least two polygons.');
      return { intersectResult: null, totalArea: 0 };
    }
  
    try {
      // Wrap the features in a FeatureCollection
      const featureCollection: FeatureCollection<Polygon> = {
        type: 'FeatureCollection',
        features: selectedPolygonFeatures,
      };
  
      // Perform intersect using the FeatureCollection
      const intersectResult = intersect(featureCollection) as Feature<Polygon | MultiPolygon>;
  
      if (!intersectResult) {
        console.error('Intersect operation failed.');
        return { intersectResult: null, totalArea: 0 };
      }
  
      // Calculate total area
      const totalArea = area(intersectResult);
  
      return { intersectResult, totalArea };
    } catch (error) {
      console.error('Intersect operation error:', error);
      return { intersectResult: null, totalArea: 0 };
    }
  };
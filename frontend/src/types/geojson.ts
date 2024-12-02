// types/geojson.ts
export interface Geometry {
    type: 'Polygon';
    coordinates: number[][][];
  }
  
  export interface Feature {
    id: string;
      type: 'Feature';
      properties: Record<string, unknown>;
      geometry: Geometry;
  }
  
  export interface FeatureCollection {
    id: string;
    type: 'FeatureCollection';
    features: Feature[];
  }
  
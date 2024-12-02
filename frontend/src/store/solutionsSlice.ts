import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureCollection } from '../types/geojson';
import { area, union as turfUnion, intersect as turfIntersect } from '@turf/turf';
import { Feature, GeoJsonProperties, MultiPolygon, Polygon, WritableDraft } from 'geojson';
import { performUnionUsingFeatureCollection, performIntersectUsingFeatureCollection } from '../utils/geometryUtils';


interface SolutionsState {
  solutions: FeatureCollection[]; // Leaving this as the list of solutions, even though we are only using one solution
  selectedSolutions: FeatureCollection[];  // Array to store multiple selected solutions
  selectedPolygons: string[]; // List of selected polygon IDs
  totalArea: number; // Total area of selected polygons
  intersectResult: Feature<Polygon | MultiPolygon> | null; // Result of the union operation
  toastMessage: string;
}

const initialState: SolutionsState = {
  solutions: [],
  selectedSolutions: [],
  selectedPolygons:[],
  totalArea: 0,
  intersectResult: null,
  toastMessage: '',
};

// Create the slice
const solutionsSlice = createSlice({
  name: "solutions",
  initialState,
  reducers: {
    setSolutions(state, action: PayloadAction<FeatureCollection[]>) {
      state.solutions = action.payload.map((solution, index) => ({
        ...solution,
        id: solution.id || `solution-${index}`, // Ensure each solution has a unique ID
      }));
    },
    updateSolutionState(state, action: PayloadAction<FeatureCollection[]>) {
      state.selectedSolutions = action.payload; // Update the selected solutions
    },
    toggleSolution(state, action: PayloadAction<{ id: string }>) {
      const solutionId = action.payload.id;
      // Check if the solution is already selected
      const isSelected = state.selectedSolutions.some(
        (solution) => solution.id === solutionId
      );

      if (isSelected) {
        // Deselect the solution
        state.selectedSolutions = [];
      } else {
        // Find the solution in the main solutions list
        const solution = state.solutions.find(
          (solution) => solution.id === solutionId
        );
        if (solution) {
          state.selectedSolutions = [solution];
        }
      }
    },
    togglePolygonSelection(state, action: PayloadAction<string>) {
      const polygonId = action.payload;
      const isSelected = state.selectedPolygons.includes(polygonId);

      if (isSelected) {
        state.selectedPolygons = state.selectedPolygons.filter(
          (id) => id !== polygonId
        ); // Deselect
      } else {
        state.selectedPolygons.push(polygonId); // Select
      }

      // Recalculate total area based on selected polygons
      state.totalArea = state.selectedPolygons.reduce((total, id) => {
        // Find the feature by ID in the solutions
        const feature = state.solutions
          .flatMap((solution) => solution.features)
          .find((feature) => feature.id === id);

        if (
          feature &&
          (feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon")
        ) {
          return total + area(feature as Feature<Polygon | MultiPolygon>);
        }
        return total;
      }, 0);
    },
    clearPolygonSelection(state) {
      state.selectedPolygons = []; // Clear all selected polygons
    },
    performUnion(state) {
      if (state.selectedPolygons.length < 2) {
        console.error("Union operation requires at least two polygons.");
        return;
      }

      // Map selected polygon IDs to their corresponding features
      const selectedPolygonFeatures = state.solutions.flatMap((solution) =>
        solution.features.filter((feature) =>
          state.selectedPolygons.includes(feature.id as string)
        )
      ) as Feature<Polygon>[];

      if (selectedPolygonFeatures.length < 2) {
        console.error("Not enough polygons found for union operation.");
        return;
      }

      const { unionResult } = performUnionUsingFeatureCollection(
        selectedPolygonFeatures
      );

      if (!unionResult) {
        console.error("Union operation failed.");
        return;
      }

      // Create a new union feature and cast it to the correct type
      const newUnionFeature = {
        ...unionResult,
        id: `union-${Date.now()}`, // Assign a unique ID
        properties: {
          ...unionResult.properties,
          generatedBy: "performUnion", // Optional metadata
        },
      } as WritableDraft<Feature>;

      // Replace the selected polygons in the solutions and update the selectedSolutions
      let updatedSolution: WritableDraft<FeatureCollection> | null = null;

      state.solutions = state.solutions.map((solution) => {
        const containsSelectedPolygons = solution.features.some((feature) =>
          state.selectedPolygons.includes(feature.id as string)
        );

        if (containsSelectedPolygons) {
          // Remove selected polygons and add the union result
          const updatedFeatures = solution.features.filter(
            (feature) => !state.selectedPolygons.includes(feature.id as string)
          );

          updatedSolution = {
            ...solution,
            features: [...updatedFeatures, newUnionFeature], // Add the new union result
          } as WritableDraft<FeatureCollection>;

          return updatedSolution; // Replace the original solution
        }

        return solution; // Keep other solutions unchanged
      });

      if (updatedSolution) {
        // Update selectedSolutions to focus on the modified solution
        state.selectedSolutions = [updatedSolution];
      }

      // console.log("state.solutions", state.solutions);

      state.totalArea = 0; // Reset the total area of selected polygons
      state.selectedPolygons = []; // Clear the selection of polygons
    },

    performIntersect(state) {
      if (state.selectedPolygons.length < 2) {
        console.error("Intersect operation requires at least two polygons.");
        return;
      }

      // Map selected polygon IDs to their corresponding features
      const selectedPolygonFeatures = state.solutions.flatMap((solution) =>
        solution.features.filter((feature) =>
          state.selectedPolygons.includes(feature.id as string)
        )
      ) as Feature<Polygon>[];

      if (selectedPolygonFeatures.length < 2) {
        console.error("Not enough polygons found for intersect operation.");
        return;
      }

      const { intersectResult } = performIntersectUsingFeatureCollection(
        selectedPolygonFeatures
      );

      if (!intersectResult) {
        state.toastMessage = 'Intersect operation is not possible for selected polygons.';
        return;
      }

      // Create a new intersect feature and cast it to the correct type
      const newIntersectFeature = {
        ...intersectResult,
        id: `intersect-${Date.now()}`, // Assign a unique ID
        properties: {
          ...intersectResult.properties,
          generatedBy: "performIntersect", // Optional metadata
        },
      } as WritableDraft<Feature>;

      // Replace the selected polygons in the solutions and update the selectedSolutions
      let updatedSolution: WritableDraft<FeatureCollection> | null = null;

      state.solutions = state.solutions.map((solution) => {
        const containsSelectedPolygons = solution.features.some((feature) =>
          state.selectedPolygons.includes(feature.id as string)
        );

        if (containsSelectedPolygons) {
          // Remove selected polygons and add the intersect result
          const updatedFeatures = solution.features.filter(
            (feature) => !state.selectedPolygons.includes(feature.id as string)
          );

          updatedSolution = {
            ...solution,
            features: [...updatedFeatures, newIntersectFeature], // Add the new intersect result
          } as WritableDraft<FeatureCollection>;

          return updatedSolution; // Replace the original solution
        }

        return solution; // Keep other solutions unchanged
      });

      if (updatedSolution) {
        // Update selectedSolutions to focus on the modified solution
        state.selectedSolutions = [updatedSolution];
      }

      // console.log("state.solutions", state.solutions);

      state.totalArea = 0; // Reset the total area of selected polygons
      state.selectedPolygons = []; // Clear the selection of polygons
      state.toastMessage = 'Intersect operation completed successfully!';
    },

  },
});

// Export actions and reducer
export const { setSolutions, updateSolutionState, toggleSolution, performIntersect, togglePolygonSelection, clearPolygonSelection, performUnion } = solutionsSlice.actions; 
export default solutionsSlice.reducer; // The reducer

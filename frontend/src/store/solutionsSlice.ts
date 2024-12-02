import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureCollection } from '../types/geojson';
import { area, union as turfUnion, intersect as turfIntersect } from '@turf/turf';
import { Feature, GeoJsonProperties, MultiPolygon, Polygon, WritableDraft } from 'geojson';
import { performUnionUsingFeatureCollection, performIntersectUsingFeatureCollection } from '../utils/geometryUtils';

// Define the initial state
interface SolutionsState {
  solutions: FeatureCollection[]; // Leaving this as the list of solutions, even though we are only using one solution
  // selectedSolutionIndex: number | null; // Index of the selected solution
  // selectedSolution: FeatureCollection | null; // The selected solution itself
  selectedSolutions: FeatureCollection[];  // Array to store multiple selected solutions
  selectedPolygons: string[]; // List of selected polygon IDs
  totalArea: number; // Total area of selected polygons
  // unionResult: Feature<Polygon | MultiPolygon> | null; // Result of the union operation
  intersectResult: Feature<Polygon | MultiPolygon> | null; // Result of the union operation

}

const initialState: SolutionsState = {
  solutions: [],
  // selectedSolutionIndex: null,
  // selectedSolution: null,
  selectedSolutions: [],
  selectedPolygons:[],
  totalArea: 0,
  // unionResult: null,
  intersectResult: null,
};

// Create the slice
const solutionsSlice = createSlice({
  name: "solutions",
  initialState,
  reducers: {
    // setSolutions(state, action: PayloadAction<FeatureCollection[]>) {
    //   state.solutions = action.payload;
    // },
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
        // Remove the solution from selectedSolutions
        // state.selectedSolutions = state.selectedSolutions.filter((solution) => solution.id !== solutionId);
        // Deselect the solution
        state.selectedSolutions = [];
      } else {
        // Find the solution in the main solutions list
        const solution = state.solutions.find(
          (solution) => solution.id === solutionId
        );
        if (solution) {
          // state.selectedSolutions.push(solution); // In case I want to select multiple solutions
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

      const { unionResult, totalArea } = performUnionUsingFeatureCollection(
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

      console.log("state.solutions", state.solutions);

      state.totalArea = 0; // Reset the total area of selected polygons
      state.selectedPolygons = []; // Clear the selection of polygons
    },

    performIntersect(state) {
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

      const { intersectResult, totalArea } =
        performIntersectUsingFeatureCollection(selectedPolygonFeatures);

      if (!intersectResult) {
        console.error("Union operation failed.");
        // state.toastMessage = 'No intersection found between the selected polygons!';
        return;
      }

      // Create a new solution containing the union result
      const intersectSolution: WritableDraft<FeatureCollection> = {
        type: "FeatureCollection",
        id: `union-${Date.now()}`, // Add a unique ID for the new solution
        features: [
          ...state.solutions.flatMap((solution) =>
            solution.features.filter(
              (feature) =>
                !state.selectedPolygons.includes(feature.id as string)
            )
          ), // Include all non-selected features
          intersectResult, // Add the union result
        ],
      };

      // Update the state
      state.solutions = state.solutions.map((solution) => {
        if (
          solution.features.some((feature) =>
            state.selectedPolygons.includes(feature.id as string)
          )
        ) {
          // Replace the solution that contains selected polygons with the union solution
          return intersectSolution;
        }
        return solution; // Keep other solutions unchanged
      });

      state.intersectResult = intersectResult;
      state.totalArea = totalArea;

      // Clear the selection of polygons
      state.selectedPolygons = [];
    },
  },
});

// Export actions and reducer
// export const { setSolutions, updateSolutionState, toggleSolution, performUnion, performIntersect } = solutionsSlice.actions; 
export const { setSolutions, updateSolutionState, toggleSolution, performIntersect, togglePolygonSelection, clearPolygonSelection, performUnion } = solutionsSlice.actions; 
export default solutionsSlice.reducer; // The reducer

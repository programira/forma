import { FeatureCollection } from '../types/geojson';
import solution1 from './mockData/solution1.json';
import solution2 from './mockData/solution2.json';

// export const getSolutions = async (): Promise<FeatureCollection[]> => {
//   // Simulate a network delay
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   // Return mocked solutions
//   return [solution1 as FeatureCollection, solution2 as FeatureCollection];
// };

export const getSolutions = async (): Promise<FeatureCollection[]> => {
    const rawSolutions = [solution1, solution2]; // Mocked JSON data
    const solutionsWithIds = rawSolutions.map((solution, index) => ({
      ...solution,
      id: `solution-${index+1}`, // Add a unique id
      features: solution.features.map((feature, featureIndex) => ({
        ...feature,
        id: `solution-${index + 1}-feature-${featureIndex + 1}`, // Add unique ID to each feature
      })),
    })) as FeatureCollection[];
    return solutionsWithIds;
  };
  
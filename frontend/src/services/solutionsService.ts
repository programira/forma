import { FeatureCollection } from '../types/geojson';
// import solution1 from './mockData/solution1.json';
// import solution2 from './mockData/solution2.json';

export const getSolutions = async (): Promise<FeatureCollection[]> => {
    // Simple way
    // const rawSolutions = [solution1, solution2]; // Mocked JSON data

    // Dinamic way to import every JSON file in the mockData folder
    const modules = import.meta.glob('./mockData/*.json');
    const rawSolutions = await Promise.all(
      Object.entries(modules).map(async ([_, module]) => (await module()) as FeatureCollection)
    );
    
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
  
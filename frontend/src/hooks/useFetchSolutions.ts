import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSolutions } from '../store/solutionsSlice';
import { getSolutions } from '../services/solutionsService';
import { AppDispatch } from '../store/store';
import { FeatureCollection } from '../types/geojson';

const useFetchSolutions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const solutions: FeatureCollection[] = await getSolutions(); // Fetch solutions
        dispatch(setSolutions(solutions)); // Dispatch to Redux store
        setError(null); // Reset any errors
      } catch (err) {
        setError((err as Error).message || 'Failed to fetch solutions');
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchSolutions();
  }, [dispatch]);

  return { loading, error }; // Return the loading and error states
};

export default useFetchSolutions;

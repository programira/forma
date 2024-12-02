import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Toolbar,
  Snackbar
} from '@mui/material';
import UnionIcon from '@mui/icons-material/MergeType';
import IntersectIcon from '@mui/icons-material/CallSplit';
import MapComponent from '../components/MapComponent/MapComponent';
import LeftSidebar from '../components/LeftSidebar/LeftSidebar';
import RightSidebar from '../components/RightSidebar/RigthSidebar';
import useFetchSolutions from '../hooks/useFetchSolutions';
import { RootState } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { performIntersect, performUnion } from '../store/solutionsSlice';

const AppLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useFetchSolutions();

  const solutions = useSelector((state: RootState) => state.solutions.solutions);
  const selectedSolutions = useSelector((state: RootState) => state.solutions.selectedSolutions);

  const selectedPolygonIds = useSelector((state: RootState) => state.solutions.selectedPolygons);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

   const handleUnion = () => {
    if (selectedPolygonIds.length < 2) {
      setSnackbar({
        open: true,
        message: 'Please select at least two polygons for the union operation!',
      });
      return;
    }

    dispatch(performUnion());
    setSnackbar({
      open: true,
      message: 'Union operation completed successfully!',
    });
  };

  const handleIntersect = () => {
    if (selectedPolygonIds.length < 2) {
      setSnackbar({
        open: true,
        message: 'Please select at least two polygons for the intersect operation!',
      });
      return;
    }
    dispatch(performIntersect());
    setSnackbar({
      open: true,
      message: 'Intersect operation completed successfully!',
    });
  };

  // const handleUpdate = (updatedFeatures: FeatureCollection[]) => {
  //   dispatch(updateSolutionState(updatedFeatures)); // Update state with the new features
  // };

  if (loading) {
    return <div>Loading solutions...</div>; // Handle loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Handle error state
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(to right, black, #1976d2)' }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1619.27 166.13"
              data-testid="uh-autodesk-logo"
              className="uh-autodesk-logo"
              style={{ height: '50%' }}
            >
              <path
                className="autodesk-logo-new_svg__uh-autodesk-logo-text"
                fill="#FFF"
                d="M1619.27 4.34h-47.94l-57.42 64.12V4.34h-40.25l.2 157.84h40.05V102.2l54.46 59.98h50.9l-73.39-77.93 73.39-79.91zm-210.51 64.91l-36.7-4.14c-21.51-2.37-26.83-7.7-26.83-15 0-8.09 11.05-15.39 32.55-15.39 20.72 0 31.57 7.7 33.54 19.34h39.46c-2-33.35-30-54.06-70.83-54.06-48.53 0-73 19.33-73 53.46 0 27.82 16.18 40.85 49.72 44.4l37.29 3.94c14.21 1.58 20.72 7.11 20.72 14.21 0 8.09-9.47 15.39-32.36 15.39-26.44 0-37.09-6.71-38.87-20.13h-38.67c1.78 36.31 25.45 54.85 76.16 54.85 46.36 0 72.21-20.32 72.21-50.9 0-26.64-15.39-42.62-44.39-45.97zm-248.8 92.93h127.06v-34.13h-86.81V99.44h69.84V65.11h-69.84V38.47h86.81V4.34h-127.06v157.84zm-94.7-157.84h-73.79v157.84h73.79c56.63 0 72.21-21.11 72.21-80.11 0-55.44-14.99-77.73-72.21-77.73zm-1.62 123.72h-32V38.47h32c25.26 0 32.75 6.91 32.75 43.6.04 33.54-8.44 45.99-32.75 45.99zM882.17 0c-57.42 0-87.21 35.31-87.21 82.86 0 47.75 29.79 83.26 87.21 83.26 57.61 0 87.4-35.51 87.4-83.26 0-47.55-29.79-82.86-87.4-82.86zm0 130.61c-29.79 0-46.17-18.15-46.17-47.75 0-29 16.38-47.35 46.17-47.35 30 0 46.17 18.35 46.17 47.35 0 29.6-16.18 47.75-46.17 47.75zM646.59 38.47h50.9v123.71h40.25V38.47h50.71V4.34H646.59v34.13zM588 101.8c0 20.52-12.63 28.81-34.14 28.81-20.91 0-34.52-8.68-34.52-28.81V4.34h-40.25v102c0 45.58 40.64 59.78 74.77 59.78 33.94 0 74.38-14.2 74.38-59.78v-102H588zM361.3 4.34l-60.57 157.84h41.63l10.57-29.6h67.62l10.4 29.6h43L412.64 4.34zm3.61 94.7l22.11-61.87 21.74 61.89zM1.24 162.19l141.34-87.92h73.32a4.28 4.28 0 014.28 4.29 3.72 3.72 0 01-2 3.6l-69.42 41.62c-4.51 2.7-6.09 8.12-6.09 12.18l-.07 26.23h88.22V9.75a5.41 5.41 0 00-5.64-5.42H141L0 91.87v70.32z"
              />
            </svg>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar */}
      <LeftSidebar />
       {/* Buttons */}
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          left: 332, // Inline with the left sidebar
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 1000,
        }}
      >
        <Button variant="contained" startIcon={<UnionIcon />} onClick={handleUnion}>
          Union
        </Button>
        <Button variant="contained" startIcon={<IntersectIcon />} onClick={handleIntersect}>
          Intersect
        </Button>
      </Box>

      {/* Center Map */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Toolbar />
        <MapComponent
  // selectedSolutions={solutions}
  // // onUpdate={(updatedFeatures) => dispatch(updateSolutionState(updatedFeatures))}
  // onUpdate={handleUpdate} // Pass the callback
  // mapData={null}
  // onSelectionChange={(selectedIds) => console.log('Selected Polygons:', selectedIds)}
  solutions={solutions}
  selectedSolutions={selectedSolutions} // Pass only selected solutions
/>
      </Box>

      {/* Right Sidebar */}
      <RightSidebar  />
      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000} // Automatically close after 3 seconds
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </Box>
  );
};

export default AppLayout;

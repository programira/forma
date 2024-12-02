import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const RightSidebar: React.FC = () => {
  const selectedSolutions = useSelector((state: RootState) => state.solutions.selectedSolutions);
  const totalArea = useSelector((state: RootState) => state.solutions.totalArea);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 16,
        width: 240,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
        color: 'black',
        borderRadius: 2,
        p: 2,
        boxShadow: 3,
        zIndex: 1300, // Above content but below AppBar
      }}
    >
      <Typography variant="h6" gutterBottom>
        Solution Statistics
      </Typography>
      {selectedSolutions.length > 0 ? (
        <Box>
          {selectedSolutions.map((solution, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2">
                Features: {solution.features ? solution.features.length : 0}
              </Typography>

            </Box>
          ))}
          <Typography variant="body2" gutterBottom>
          <strong>Total Area of selected polygons: {totalArea.toFixed(2)} m²</strong>
          </Typography>
        </Box>
      ) : (
        <Typography>No solution selected.</Typography>
      )}
    </Box>
  );
};

export default RightSidebar;

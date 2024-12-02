import React, { useEffect } from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon, Checkbox, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import  { toggleSolution }  from '../../store/solutionsSlice';
import { FeatureCollection } from '../../types/geojson';

const LeftSidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const solutions = useSelector((state: RootState) => state.solutions.solutions);
	const selectedSolutions = useSelector((state: RootState) => state.solutions.selectedSolutions);

	// useEffect(() => {
	// 	console.log('Solutions in LeftSidebar:', solutions);
	// }, [solutions]);

	const handleToggle = (id: string) => {
		dispatch(toggleSolution({ id }));
	};
	
	if (!solutions.length) {
    return <div>Loading sidebar...</div>;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        left: 16,
        width: 300,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black
        color: 'white',
        borderRadius: 2,
        p: 2,
        boxShadow: 3,
        zIndex: 1300, // Above content but below AppBar
      }}
    >
      <Typography variant="h6" gutterBottom>
        Proposed Solutions
      </Typography>
      <List>
        {solutions.map((solution, index) => (
          <ListItem
            key={index}
            component="li"
            // onClick={() => handleToggle(solution)}
						onClick={() => handleToggle(solution.id)}
            sx={{
              backgroundColor: selectedSolutions.includes(solution) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              borderRadius: 1, 
              mb: 1,
            }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={selectedSolutions.includes(solution)}
                sx={{ 
									color: 'white',
									'&.Mui-checked': {
                    color: 'rgba(255, 255, 255, 0.7)', // Ensure visible when checked
                  },
								}}
              />
            </ListItemIcon>
            <ListItemText
              primary={`Solution ${index + 1} (${solution.features.length} features)`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LeftSidebar;

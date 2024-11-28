// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Button, Typography, Container } from '@mui/material';
import './App.css'

function App() {

  return (
    <>
      <Container>
        <Typography variant="h3" color="primary" gutterBottom>
          Welcome to my Autodesk App
        </Typography>
        <Button variant="contained" color="secondary">
          Click Me
        </Button>
      </Container>
    </>
  )
}

export default App

import { Box, Typography } from "@mui/material";
import Home from "./pages/Home";
import UTD from "./assets/utd_logo.png";
import { gsap } from 'gsap';
import { useEffect, useRef } from "react";

const App = () => {
  const logoRef = useRef(null); // Referencia para el elemento del logo

  const handleMouseEnter = () => {
    gsap.to(logoRef.current, {
      rotation:  360,
      duration:  3, 
      repeat: -1,
      ease: 'none'
    });
  };

  // Función para manejar el evento onMouseLeave
  const handleMouseLeave = () => {
    gsap.killTweensOf(logoRef.current); // Detiene todas las animaciones del logo
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt:  8, flexDirection: "column" }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: "10px" }}>
          CRUD Curriculums
        </Typography>
        <Box sx={{ textAlign: "center", mb: "10px" }}>
          <img
            ref={logoRef} // Asignar la referencia al elemento
            className='logo'
            src={UTD}
            alt="Logo UTD"
            style={{ width: "10rem" }}
            onMouseEnter={handleMouseEnter} // Evento onMouseEnter
            onMouseLeave={handleMouseLeave} // Evento onMouseLeave
          />
        </Box>
      </Box>
      <Home />
    </Box>
  );
};

export default App;

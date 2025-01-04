import { Box } from "@chakra-ui/react";
import Identificate from "./Identificate";
import { useParams } from "react-router-dom";
import Checkout from "./Checkout";
import { useState } from "react";
import Sesion from "./Sesion";

const PrevSesion = () => {
  const param = useParams();
  const storedNombre = localStorage.getItem("nombre");
  const storedApellido = localStorage.getItem("apellido");
  const clienteID = localStorage.getItem("clienteID");
  const [openIdentificarse, setOpenIdentificarse] = useState(!storedNombre || !storedApellido ? true : false);
  const [openCheckout, setOpenCheckout] = useState(!openIdentificarse);
  
  return (
    <Box p={4} backgroundColor="#FFFEEE" minH="100vh">
      {openIdentificarse &&
        <Identificate
          closeModal={() => {
            setOpenIdentificarse(false);
          }}
        />
      }

      {openCheckout &&
        <Checkout
          mesaQR={param?.qr}
          clienteID={clienteID}
          closeModal={() => setOpenCheckout(false)}
        />
      }

      {!openIdentificarse && !openCheckout &&
        <Sesion
          mesaQR={param?.qr}
          clienteID={clienteID}
        />
      }
    </Box>
  );
}

export default PrevSesion;
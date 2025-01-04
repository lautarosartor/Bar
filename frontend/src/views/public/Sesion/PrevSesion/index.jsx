import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Identificate from "./Identificate";
import Checkout from "./Checkout";
import Sesion from "../";

const PrevSesion = () => {
  const param = useParams();
  const storedDNI = localStorage.getItem("dni");
  const clienteID = localStorage.getItem("clienteID");
  const [openIdentificarse, setOpenIdentificarse] = useState(!storedDNI);
  const [openCheckout, setOpenCheckout] = useState(!openIdentificarse);

  useEffect(() => {
    if (!openIdentificarse) {
      setOpenCheckout(true);
    }
  }, [openIdentificarse]);
  
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
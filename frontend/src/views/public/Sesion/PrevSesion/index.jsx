import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Identificate from "./Identificate";
import Checkout from "./Checkout";
import Sesion from "../";

const PrevSesion = () => {
  const param = useParams();
  const storedDNI = localStorage.getItem("dni");
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
          clienteDni={storedDNI}
          closeModal={() => setOpenCheckout(false)}
        />
      }

      {!openIdentificarse && !openCheckout &&
        <Sesion
          mesaQR={param?.qr}
          clienteDni={storedDNI}
        />
      }
    </Box>
  );
}

export default PrevSesion;
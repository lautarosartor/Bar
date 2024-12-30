import { Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { api } from "services/api";
import NotFound from "components/NotFound";
import ModalIdentificacion from "./components/ModalIdentificacion";
import BtnCerrarSesion from "./components/BtnCerrarSesion";
import DrawerCarrito from "./components/DrawerCarrito";
import './components/sesion-activa.css'

function Sesion() {
  const param = useParams();
  const [message, setMessage] = useState("");
  const [sesion, setSesion] = useState(false);

  useEffect(() => {
    const createSesion = async (qr) => {
      
      try {
        const clienteID = parseInt(localStorage.getItem("clienteID")) || 0;
        const sesionID = parseInt(localStorage.getItem("sesionID")) || 0;
        const data = {
          id: clienteID,
          idsesion: sesionID
        }

        console.log("datos a pasar: ", data);

        const response = await api.sesiones.createSesion(
          qr,
          data
        );

        if (response.status === "success") {
          setSesion(true);
          if (!clienteID) {
            localStorage.setItem("clienteID", response.data.cliente.id);
            
          }
          if (!sesionID) {
            localStorage.setItem("sesionID", response.data.cliente.idsesion);
          }
          console.log(response.message);
          setMessage(response.message);
        }
        else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.log(error.message);
        setMessage(error.message);
      }
    }
    createSesion(param.qr);
  }, [param.qr]);

  if (sesion) {
    return (
      <Box p={4} backgroundColor="#FFFEEE" minH="100vh">
        {/*Muestra modal en caso de no estar identificado*/}
        <ModalIdentificacion />

        {/*Boton para cerrar la sesion*/}
        <div className="flex justify-between mb-10">
          <p className="text-4xl font-bold">
            {message}
          </p>

          <BtnCerrarSesion />
        </div>

        <Box p={4} backgroundColor="#FFF" rounded="xl" shadow="xl" minH="20vh" maxW="1000px"
          className="flex flex-col justify-between gap-4 mx-auto"
        >
          <div className="flex justify-between text-lg font-medium pb-4 border-b-2">
            <p>Carrito de pedidos en grupo</p>
            <p>Total $ 1234</p>
          </div>
          <small>3 items en el carrito</small>

          <div className="fondo-carrito-grupal flex flex-col justify-center p-2 gap-4 rounded-xl">
            <div className="self-end flex flex-wrap gap-2 rounded-xl bg-[#5d8926] text-[#fff] p-2 w-3/4" style={{maxWidth: '500px'}}>
              <img src="src/assets/menu/comidas/pizza.jpg" alt="IMG" className="rounded-xl" style={{height: '80px', width: '80px'}} />

              <div>
                <small><i>Lauty</i></small>
                <p className="font-medium">Italy Pizza</p>
                <small>Extra cheese and toping</small>
              </div>
            </div>

            <div className="self-start flex flex-wrap gap-2 rounded-xl bg-[#5d8926] text-[#fff] p-2 w-3/4" style={{maxWidth: '500px'}}>
              <img src="src/assets/menu/comidas/pizza.jpg" alt="IMG" className="rounded-xl" style={{height: '80px', width: '80px'}} />

              <div>
                <small><i>Messi</i></small>
                <p>Spanish Rice</p>
                <small>Extra garllic</small>
              </div>
            </div>
          </div>

          <div className="flex align-center justify-between">
            <p className="self-center font-medium">Gastos personales $234</p>
            {/*Boton del drawer del carrito*/}
            <DrawerCarrito />
          </div>
        </Box>
      </Box>
    )
  }
  else {
    return (
      <NotFound
        message={message}
      />
    );
  }
}

export default Sesion
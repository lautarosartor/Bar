import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, useDisclosure } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../services/api";
import NotFound from "../../../components/NotFound";
import useSesion from "../../../hooks/hookSesion";

function Sesion() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const param = useParams();
  const [message, setMessage] = useState("");
  const [sesion, setSesion] = useState(false);
  const { deleteSesion } = useSesion();
  const navigate = useNavigate();

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

  const handleCloseSesion = async () => {
    const sesionID = localStorage.getItem("sesionID");

    if (sesionID) {
      await deleteSesion(sesionID)
      navigate("/");
    }
    else {
      console.log("error");
    }
  }

  if (sesion) {
    return (
      <div className="p-4" style={{minHeight: '100vh', backgroundColor: '#9BC4BC'}}>
        <p className="text-5xl">
          {message}
        </p>
        <Button onClick={() => handleCloseSesion()}>
          Cerrar la sesión
        </Button>
        <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
          Open
        </Button>
        <p>{message}</p>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Carrito de pedidos</DrawerHeader>
  
            <DrawerBody>
              <Input placeholder='Type here...' />
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue'>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    )
  }
  else {
    return (
      <div className="flex flex-col justify-center align-center gap-10" style={{height: '100vh'}}>
        <NotFound tipo={1} />
        <p className="text-[#fff] text-center">{message}</p>
        <a href="/" className="text-center self-center py-2 px-4 rounded-xl bg-[#85CB33]">Volver</a>
      </div>
    );
  }
}

export default Sesion
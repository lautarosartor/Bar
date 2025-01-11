import { Box, Heading, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import BtnCerrarSesion from "./components/BtnCerrarSesion";
import './components/styles.css'

const Sesion = ({ sesion }) => {
  // const { grupo } = useGrupo();
  
  return (
    <Box p={4}>
      {/*Boton para cerrar la sesion*/}
      <div className="flex justify-between mb-10">
        <Heading>Bienvenido a la {sesion?.mesa?.nombre_mesa}</Heading>

        <BtnCerrarSesion />
      </div>

      <Box backgroundColor="#100B0025" rounded="xl" shadow="xl" minH="30vh" maxW="1000px"
        className="flex flex-col justify-between p-4 gap-4 mx-auto"
      >
        <div className="flex justify-between text-lg font-medium pb-4 border-b-2">
          <Text>Carrito de pedidos en grupo</Text>
          <Text fontWeight="bold">Total $ 1234</Text>
        </div>

        <Text as="small">3 items en el carrito</Text>

        <Box display="flex" flexDirection="column" justifyContent="center" rounded="xl" minH="30vh" 
          className="fondo-carrito-grupal p-4 gap-4">
          <Box alignSelf="end" display="flex" flexWrap="wrap" rounded="xl"
            className="bg-[#448225] text-[#fff] p-2 gap-2 w-3/4" style={{maxWidth: '500px'}}>
            <img src="/src/assets/menu/comidas/pizza.jpg" alt="IMG" className="rounded-xl" style={{height: '80px', width: '80px'}} />

            <div>
              <small><i>Lauty</i></small>
              <p className="font-medium">Italy Pizza</p>
              <small>Extra cheese and toping</small>
            </div>
          </Box>

          <Box alignSelf="start" display="flex" flexWrap="wrap" rounded="xl"
            className="bg-[#448225] text-[#fff] p-2 gap-2 w-3/4" style={{maxWidth: '500px'}}>
            <img src="/src/assets/menu/comidas/pizza.jpg" alt="IMG" className="rounded-xl" style={{height: '80px', width: '80px'}} />

            <div>
              <Text as="small"><i>Messi</i></Text>
              <Text>Spanish Rice</Text>
              <Text as="small">Extra garllic</Text>
            </div>
          </Box>
        </Box>

        <div className="flex align-center justify-between">
          <p className="self-center font-medium">Gastos personales $234</p>
          {/*Boton del drawer del carrito*/}
          {/* <DrawerCarrito /> */}
        </div>
      </Box>
    </Box>
  );
}

// Validacion de props
Sesion.propTypes = {
  sesion: PropTypes.any,
};

export default Sesion;
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Grid, GridItem } from '@chakra-ui/react'

const PrivateRoute = ({ children }) => {
  // Aquí es donde comprobarías si el usuario está autenticado
  const isAuthenticated = sessionStorage.getItem("token");

  // Si esta authenticado muestra los componentes, sino lo redirige a logearse
  if (isAuthenticated) {
    return (
      <div className="flex-grow bg-[#fff]">
        <Grid
          minH="100vh"
          templateRows='repeat(1, 1fr)'
          templateColumns='repeat(6, 1fr)'
        >
          <GridItem rowSpan={2} colSpan={1} bg="#3B341F" p={4}>
            <nav className="text-xl text-[#EFFFC8]">
              <a className="flex justify-center font-black text-2xl mb-10 text-[#85CB33]" href="/">
                Rest In Beer
              </a>

              <ul className="space-y-6">
                <li>
                  <a href="/admin/dashboard">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/admin/mesas" disabled>
                    Mesas
                  </a>
                </li>
                <li>
                  <a href="/admin/productos">
                    Productos
                  </a>
                </li>
                <li>
                  <a href="/admin/sesiones" disabled>
                    Sesiones
                  </a>
                </li>
              </ul>
            </nav>
          </GridItem>
          
          <GridItem colSpan={5} p={4}>
            <main className="py-10">
              {children}
            </main>
          </GridItem>
        </Grid>
      </div>
    )
  }
  else {
    return <Navigate to="/login" />
  }
};

// Validacion de props
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
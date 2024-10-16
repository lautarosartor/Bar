import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Grid, GridItem } from '@chakra-ui/react'

const PrivateRoute = ({ children }) => {
  // Aquí es donde comprobarías si el usuario está autenticado
  const isAuthenticated = sessionStorage.getItem("token");

  const navigate = useNavigate();

  // Si esta authenticado muestra los componentes, sino lo redirige a logearse
  if (isAuthenticated) {
    return (
      <div className="flex-grow bg-[#fff]">
        <Grid
          minH="100vh"
          templateRows='repeat(1, 1fr)'
          templateColumns='repeat(6, 1fr)'
        >
          {/*NAV*/}
          <GridItem as="nav" rowSpan={2} colSpan={1} bg="#3B341F" textColor="#EFFFC8" p={4}>
            <a className="flex justify-center font-black text-2xl mb-10 text-[#85CB33]" href="/">
              Rest In Beer
            </a>

            <ul className="space-y-6">
              <li>
                <a
                  className={location.pathname === "/admin/dashboard" ? "active-link" : ""}
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  className={location.pathname === "/admin/mesas" ? "active-link" : ""}
                  onClick={() => navigate("/admin/mesas")}
                >
                  Mesas
                </a>
              </li>
              <li>
                <a
                  className={location.pathname === "/admin/productos" ? "active-link" : ""}
                  onClick={() => navigate("/admin/productos")}
                >
                  Productos
                </a>
              </li>
              <li>
                <a
                  className={location.pathname === "/admin/sesiones" ? "active-link" : ""}
                  onClick={() => navigate("/admin/sesiones")}
                >
                  Sesiones
                </a>
              </li>
              <li>
                <a
                  className={location.pathname === "/admin/usuarios" ? "active-link" : ""}
                  onClick={() => navigate("/admin/usuarios")}
                >
                  Usuarios
                </a>
              </li>
            </ul>
          </GridItem>
          
          {/*MAIN*/}
          <GridItem as="main" colSpan={5} p={4}>
            {children}
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
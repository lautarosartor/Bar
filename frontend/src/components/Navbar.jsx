import { Flex, Grid, GridItem } from "@chakra-ui/react"
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'

function Navbar({ children }) {
  const navigate = useNavigate();
  const [showAdministrar, setShowAdministrar] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <Grid
      minH="100vh"
      flexGrow={1}
      templateRows='repeat(1, 1fr)'
      templateColumns='repeat(6, 1fr)'
      backgroundColor="#fff"
    >
      {/*NAV*/}
      <GridItem
        as="nav"
        p={4}
        rowSpan={2}
        colSpan={1}
        minW={280}
        className="nav-admin hidden xl:block"
      >
        <Flex direction="column" h="full">
          <a className="flex justify-center font-black text-2xl mb-10 text-[#8DDBE0]" href="/">
            Rest In Beer
          </a>

          <ul className="flex flex-col gap-4">
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
                className={location.pathname === "/admin/pedidos" ? "active-link" : ""}
                onClick={() => navigate("/admin/pedidos")}
              >
                Pedidos
              </a>
            </li>
            <li>
              <a onClick={() => setShowAdministrar(!showAdministrar)}>
                Administrar
                {showAdministrar ? <ChevronUpIcon fontSize={25} /> : <ChevronDownIcon fontSize={25} />}
              </a>
            </li>
            {showAdministrar &&
              <div className="ps-4 flex flex-col gap-2">
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
                    className={location.pathname === "/admin/promociones" ? "active-link" : ""}
                    onClick={() => navigate("/admin/promociones")}
                  >
                    Promociones
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
              </div>
            }
          </ul>

          <div
            className="text-center mt-auto"
            onClick={() => handleLogout()}
          >
            Cerrar Sesión
          </div>
        </Flex>
      </GridItem>
      
      {/*MAIN*/}
      <GridItem as="main" colSpan={{base: 6, xl: 5}} p={4}>
        {children}
      </GridItem>
    </Grid>
  )
}

// Validacion de props
Navbar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Navbar
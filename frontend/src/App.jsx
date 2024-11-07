import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./views/public/Home"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Services from "./views/public/Services"
import About from "./views/public/About"
import Testimonials from "./views/public/Testimonials"
import NotFound from "./components/NotFound"
import Menu from "./views/public/Menu"
import Contact from "./views/public/Contact"
import PrivateRoute from "./providers/PrivateRoute"
import Productos from "./views/private/productos/Productos"
import Login from "./views/private/auth/Login"
import Register from "./views/private/auth/Register"
import Dashboard from "./views/private/Dashboard"
import Mesas from "./views/private/mesas/Mesas"
import Sesiones from "./views/private/sesiones/Sesiones"
import Usuarios from "./views/private/usuarios/Usuarios"
import Pedidos from "./views/private/pedidos/Pedidos"
import Sesion from "./views/private/sesiones/Sesion"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/*" element={
          <>
            <Header />
            <main className="flex-grow container mx-auto my-20 space-y-20 md:my-32 md:space-y-32 px-6 md:px-10 xl:px-28">
              <Routes>
                <Route exact path="/"
                  element={
                    <>
                      <Home />
                      <About />
                      <Menu />
                      <Services />
                      <Testimonials />
                      <Contact />
                    </>
                  }
                />
                <Route path="*" element={<NotFound tipo={1} />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />

        {/* Autenticacion */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas */}
        <Route path="/admin/*"
          element={
            <PrivateRoute> {/* Protege las rutas de administración */}
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pedidos"   element={<Pedidos />} />
                <Route path="mesas"     element={<Mesas />} />
                <Route path="productos" element={<Productos />} />
                <Route path="sesiones"  element={<Sesiones />} />
                <Route path="usuarios"  element={<Usuarios />} />
                <Route path="*" element={<NotFound tipo={1} />} />
              </Routes>
            </PrivateRoute>
          }
        />

        <Route exath path="/:qr" element={<Sesion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

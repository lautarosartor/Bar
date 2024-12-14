import { BrowserRouter, Route, Routes } from "react-router-dom"
import { lazy } from "react";
import PrivateRoute from "./providers/PrivateRoute"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./views/public/Home"
import Services from "./views/public/Services"
import About from "./views/public/About"
import Testimonials from "./views/public/Testimonials"
import Menu from "./views/public/Menu"
import Contact from "./views/public/Contact"
import NotFound from "./components/NotFound"
import Sesion from "./views/private/sesiones/Sesion"

const LoginPage = lazy(() => import("./views/private/auth/login"));
const RegisterPage = lazy(() => import("./views/private/auth/register"));
const DashboardPage = lazy(() => import("./views/private/dashboard"));
const PedidosPage = lazy(() => import("./views/private/pedidos"));
const MesasPage = lazy(() => import("./views/private/mesas"));
const ProductosPage = lazy(() => import("./views/private/productos"));
const SesionesPage = lazy(() => import("./views/private/sesiones"));
const UsuariosPage = lazy(() => import("./views/private/usuarios"));

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas privadas */}
        <Route path="/admin/*"
          element={
            <PrivateRoute> {/* Protege las rutas de administración */}
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="pedidos"   element={<PedidosPage />} />
                <Route path="mesas"     element={<MesasPage />} />
                <Route path="productos" element={<ProductosPage />} />
                <Route path="sesiones"  element={<SesionesPage />} />
                <Route path="usuarios"  element={<UsuariosPage />} />
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

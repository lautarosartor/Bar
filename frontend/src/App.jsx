import { BrowserRouter, Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react";
import PrivateRoute from "providers/PrivateRoute"
import Header from "components/Header"
import Footer from "components/Footer"
import Home from "views/landing/Home"
import Services from "views/landing/Services"
import About from "views/landing/About"
import Testimonials from "views/landing/Testimonials"
import Menu from "views/landing/Menu"
import Contact from "views/landing/Contact"
import NotFound from "components/NotFound"
import Loading from "components/Loading";

const LoginPage = lazy(() => import("./views/private/auth/login"));
const RegisterPage = lazy(() => import("./views/private/auth/register"));
const DashboardPage = lazy(() => import("views/private/dashboard"));
const PedidosPage = lazy(() => import("views/private/pedidos"));
const MesasPage = lazy(() => import("views/private/mesas"));
const ProductosPage = lazy(() => import("views/private/productos"));
const SesionesPage = lazy(() => import("views/private/sesiones"));
const UsuariosPage = lazy(() => import("views/private/usuarios"));
const PrevSesion = lazy(() => import("views/private/sesiones/prevsesion"));

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/*"
          element={
            <>
              <Header />
              <main className="flex-grow container mx-auto my-20 space-y-20 md:my-32 md:space-y-32 px-6 md:px-10 xl:px-28">
                <Routes>
                  <Route exact path="/"
                    element={
                      <Suspense fallback={<Loading fullscreen />}>
                        <Home />
                        <About />
                        <Menu />
                        <Services />
                        <Testimonials />
                        <Contact />
                      </Suspense>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

        {/* Autenticacion */}
        <Route path="/login"
          element={
            <Suspense fallback={<Loading fullscreen />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route path="/register"
          element={
            <Suspense fallback={<Loading fullscreen />}>
              <RegisterPage />
            </Suspense>
          }
        />

        {/* Rutas privadas */}
        <Route path="/admin/*"
          element={
            <PrivateRoute> {/* Protege las rutas de administración */}
              <Suspense fallback={<Loading fullscreen />}>
                <Routes>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="pedidos"   element={<PedidosPage />} />
                  <Route path="mesas"     element={<MesasPage />} />
                  <Route path="productos" element={<ProductosPage />} />
                  <Route path="sesiones"  element={<SesionesPage />} />
                  <Route path="usuarios"  element={<UsuariosPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route exath path="/sesion/:qr"
          element={
            <Suspense fallback={<Loading fullscreen />}>
              <PrevSesion />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

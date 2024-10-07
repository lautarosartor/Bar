package routes

import (
	"bar/config"
	authController "bar/controllers/auth"
	categoriasController "bar/controllers/categorias"
	clientesController "bar/controllers/clientes"
	usuariosController "bar/controllers/usuarios"
	"bar/routes/middleware"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

func InitRoutes(e *echo.Echo) {
	a := e.Group("/api")		// privado con JWT
	b := e.Group("/public")	// publico

	// Configurar el middleware de JWT
	config.LoadEnvProps(".env")
	cfg := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(middleware.JwtCustomClaims)	// claims personalizados
		},
		SigningKey: []byte(config.GetString("JWT_KEY")),	// clave secreta para firmar y validar los token JWT
	}

	// Aplicamos el middleware a las rutas privadas
	a.Use(echojwt.WithConfig(cfg))

	//======================================================================================================

	// endpoint de bienvenida
	a.GET("", authController.Restricted)

	// auth
	b.POST("/login", authController.Login)

	// users
	a.GET("/usuarios", usuariosController.GetAll)
	a.GET("/usuario/:id", usuariosController.Get)

	// categories
	a.GET("/categorias", categoriasController.GetAll)

	// customers
	a.GET("/clientes", clientesController.GetAll)
	a.GET("/cliente/:id", clientesController.Get)
}
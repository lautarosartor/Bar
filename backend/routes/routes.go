package routes

import (
	categoriasController "bar/controllers/categorias"
	clientesController "bar/controllers/clientes"
	usuariosController "bar/controllers/usuarios"

	"github.com/labstack/echo/v4"
)

func InitRoutes(e *echo.Echo) {
	a := e.Group("/api")

	// users
	a.GET("/usuarios", usuariosController.GetAll)
	a.GET("/usuario/:id", usuariosController.Get)

	// categories
	a.GET("/categorias", categoriasController.GetAll)

	// customers
	a.GET("/clientes", clientesController.GetAll)
	a.GET("/cliente/:id", clientesController.Get)
}
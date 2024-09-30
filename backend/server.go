package main

import (
	"bar/config"
	"bar/database"
	routes "bar/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	// Middleware
	//e.Use(middleware.Logger())
	//e.Use(middleware.Recover())
	//e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
	//	AllowOrigins: []string{"*"},
	//	AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	//}))

	config.LoadEnvProps(".env")
	database.InitDb(config.GetString("DB_STR"))

	// API routes
	routes.InitRoutes(e)

	// Start server
	e.Logger.Fatal(e.Start(config.GetString("DB_PORT")))
}
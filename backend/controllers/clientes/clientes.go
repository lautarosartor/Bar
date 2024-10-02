package clientes

import (
	"bar/database"
	"bar/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ResponseMessage struct {
	Status  string `json:"status"`
	Data    Data   `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type Data struct {
	Cliente	 			*models.Clientes 	`json:"cliente,omitempty"`
	Clientes 			[]models.Clientes `json:"clientes,omitempty"`
	TotalDataSize int64							`json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()
	
	var totalDataSize int64 = 0
	var clientes []models.Clientes

	db.Joins(`
		JOIN sesiones
		ON clientes.idsesion = sesiones.id
		AND activo = ?`, 1).
		Preload("Sesion.Mesa").
		Preload("Rol").
		Find(&clientes).
		Count(&totalDataSize)
	
	if totalDataSize == 0 {
		return c.JSON(http.StatusOK, ResponseMessage{
			Status:		"success",
			Message:	"Aún no hay clientes con sesiones activas",
		})
	}

	data := Data{Clientes: clientes, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	clienteID := c.Param("id")
	cliente := new(models.Clientes)

	db.Preload("Sesion.Mesa").Preload("Rol").First(&cliente, clienteID)

	data := Data{Cliente: cliente}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}
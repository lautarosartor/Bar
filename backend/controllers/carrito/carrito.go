package carrito

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
	Carrito       []models.Pedidos `json:"carrito,omitempty"`
	TotalDataSize int64            `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()
	sesionID := c.Param("id")

	db = db.Where("idsesion = ?", sesionID)

	var totalDataSize int64
	db.Table("pedidos").Count(&totalDataSize)

	var pedidos []models.Pedidos
	db.Preload("Cliente").
		Preload("Estado").
		Preload("Items.Producto").
		Find(&pedidos)

	data := Data{Carrito: pedidos}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status: "success",
		Data:   data,
	})
}

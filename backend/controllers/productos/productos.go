package productos

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
	Producto      *models.Productos  `json:"producto,omitempty"`
	Productos     []models.Productos `json:"productos,omitempty"`
	TotalDataSize int64              `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var productos []models.Productos

	db.Find(&productos).Count(&totalDataSize)

	data := Data{Productos: productos, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	productoID := c.Param("id")
	producto := new(models.Productos)

	db.Preload("Subcategoria").First(&producto, productoID)
	if producto.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Producto no encontrado.",
		})
	}

	data := Data{Producto: producto}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}
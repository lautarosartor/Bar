package promociones

import (
	"bar/database"
	"bar/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

type ResponseMessage struct {
	Status  string `json:"status"`
	Data    Data   `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type Data struct {
	Promocion     *models.Promociones  `json:"promocion,omitempty"`
	Promociones   []models.Promociones `json:"promociones,omitempty"`
	TotalDataSize int64                `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var promociones []models.Promociones

	db.Find(&promociones).Count(&totalDataSize)

	data := Data{Promociones: promociones, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	promocionID := c.Param("id")
	promocion := new(models.Promociones)

	db.Where("fecha_finalizacion <= ?", time.Now()).First(&promocion, promocionID)

	data := Data{Promocion: promocion}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}
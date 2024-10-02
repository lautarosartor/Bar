package usuarios

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
	Usuario       *models.Usuarios  `json:"usuario,omitempty"`
	Usuarios      []models.Usuarios `json:"usuarios,omitempty"`
	TotalDataSize int64             `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()
	
	var totalDataSize int64 = 0
	var usuarios []models.Usuarios
	
	db.Where("activo = ?", 1).
		Preload("Rol").
		Omit("password").
		Find(&usuarios).
		Count(&totalDataSize)


	data := Data{Usuarios: usuarios, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	userID := c.Param("id")
	usuario := new(models.Usuarios)

	db.Where("activo = ?", 1).Preload("Rol").First(&usuario, userID)

	data := Data{Usuario: usuario}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}
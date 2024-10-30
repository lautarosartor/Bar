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

	db.Where("activo = ?", 1).Omit("password").Preload("Rol").First(&usuario, userID)

	data := Data{Usuario: usuario}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Update(c echo.Context) error {
	db := database.GetDb()
	usuarioID := c.Param("id")
	request := new(models.Usuarios)

	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}

	// Buscamos si la mesa existe
	usuario := new(models.Usuarios)
	db.First(&usuario, usuarioID)
	if usuario.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Usuario no encontrado.",
		})
	}

	if err := db.Where("id = ?", usuario.ID).Updates(&request).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado al actualizar el usuario.",
		})
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:		"success",
		Message:	"¡Usuario actualizado con éxito!.",
	})
}
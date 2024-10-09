package mesas

import (
	"bar/database"
	"bar/models"
	"bar/utils"
	"fmt"
	"net/http"

	"github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
)

type ResponseMessage struct {
	Status  string `json:"status"`
	Data    Data   `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type Data struct {
	Mesas         []models.Mesas `json:"mesas,omitempty"`
	Mesa          *models.Mesas  `json:"mesa,omitempty"`
	TotalDataSize int64          `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var mesas []models.Mesas

	db.Find(&mesas).Count(&totalDataSize)

	data := Data{Mesas: mesas, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	mesaID := c.Param("id")
	mesa := new(models.Mesas)

	db.First(&mesa, mesaID)
	if mesa.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Mesa no encontrada.",
		})
	}

	data := Data{Mesa: mesa}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Create(c echo.Context) error {
	db := database.GetDb()
	payload := new(models.Mesas)

	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}

	// Validación manual de los campos requeridos
	if payload.NombreMesa == "" || payload.Capacidad == 0 {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "El nombre de la mesa y la capacidad son requeridos.",
		})
	}

	newMesa := &models.Mesas{
		NombreMesa:		payload.NombreMesa,
		Capacidad:		payload.Capacidad,
		CodigoQR:			utils.GenerateRandomCode(10),
		Descripcion:	payload.Descripcion,
	}

	// Creamos la mesa
	if err := db.Create(&newMesa).Error; err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return c.JSON(http.StatusBadRequest, ResponseMessage{
				Status:		"error",
				Message:	fmt.Sprintf("Ya posees una mesa '%v'.", newMesa.NombreMesa),
			})
		} else {
			return c.JSON(http.StatusInternalServerError, ResponseMessage{
				Status:		"error",
				Message:	"Error inesperado al crear la mesa.",
			})
		}
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:		"success",
		Message:	"¡Mesa creada con éxito!.",
	})
}

func Update(c echo.Context) error {
	db := database.GetDb()
	mesaID := c.Param("id")
	request := new(models.Mesas)

	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}

	// Buscamos si la mesa existe
	mesa := new(models.Mesas)
	db.First(&mesa, mesaID)
	if mesa.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Mesa no encontrada.",
		})
	}

	if err := db.Where("id = ?", mesa.ID).Updates(&request).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado al actualizar la mesa.",
		})
	}

	return c.JSON(http.StatusOK, ResponseMessage{
		Status:		"success",
		Message:	"¡Mesa actualizada con éxito!.",
	})
}
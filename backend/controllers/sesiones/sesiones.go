package sesiones

import (
	"bar/database"
	"bar/models"
	"fmt"
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
	Cliente				*models.Clientes	`json:"cliente,omitempty"`
	Sesion        *models.Sesiones  `json:"sesion,omitempty"`
	Sesiones      []models.Sesiones `json:"sesiones,omitempty"`
	TotalDataSize int64             `json:"totalDataSize,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var totalDataSize int64 = 0
	var sesiones []models.Sesiones

	if c.QueryParam("activas") == "true" {
		db = db.Where("activo = ?", 1)
	}

	db.Preload("Mesa").Order("finished_at ASC").Find(&sesiones).Count(&totalDataSize)

	if len(sesiones) == 0 {
		return c.JSON(http.StatusOK, ResponseMessage{
			Status:		"success",
			Message:	"Aún no hay sesiones activas hoy.",
		})
	}

	data := Data{Sesiones: sesiones, TotalDataSize: totalDataSize}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Get(c echo.Context) error {
	db := database.GetDb()
	sesionID := c.Param("id")
	sesion := new(models.Sesiones)
	
	db.Preload("Mesa").First(&sesion, sesionID)
	if sesion.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Sesión no encontrada.",
		})
	}
	
	data := Data{Sesion: sesion}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}

func Create(c echo.Context) error {
	db := database.GetDb()
	QR := c.Param("qr")
	payload := new(models.Clientes)
	
	// Payload almacenado en localStorage
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}
	fmt.Println("payload: ", payload)
	
	// Validación manual de los campos requeridos
	if QR == "" {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:  "error",
			Message: "Debes escanear el código QR que está en tu mesa.",
		})
	}

	mesa := new(models.Mesas)
	db.Where("codigo_qr = ?", QR).First(&mesa)
	if mesa.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Mesa no encontrada, intentalo de nuevo.",
		})
	}

	// Buscamos si hay una sesion activa en la mesa
	sesion := new(models.Sesiones)
	db.Where("idmesa = ? AND activo = ?", mesa.ID, 1).First(&sesion)

	// En caso de que la mesa tenga sesion activa:
	if sesion.ID != 0 {
		// Buscamos si el idsesion pasado en payload coincide con la sesion activa de la mesa
		if sesion.ID == payload.Idsesion {
			fmt.Println("idsesion, payload: ", sesion.ID, payload.Idsesion)

			// Buscamos si el cliente entro anteriormente a la sesion
			cliente := new(models.Clientes)
			db.Where("id = ? AND idsesion = ?", payload.ID, payload.Idsesion).First(&cliente)
			fmt.Println("idcliente, payload: ", cliente.ID, payload.ID)

			if cliente.ID != 0 {
				return c.JSON(http.StatusOK, ResponseMessage{
					Status: 	"success",
					Message:	"¡Bienvenido de nuevo!",
				})
			}
		}

		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status: 	"error",
			Message:	"Esta mesa ya tiene una sesión activa. Para unirte accedé al siguiente link: (proximamente)",
		})
	}

	// Si no esta activa la creamos
	newSesion := &models.Sesiones{
		Idmesa: mesa.ID,
		Activo: true,
	}

	if err := db.Create(&newSesion).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado al crear la sesión.",
		})
	}

	newCliente := &models.Clientes{
		Idsesion:	newSesion.ID,
		Idrol:		3,	// Cliente
	}

	if err := db.Create(&newCliente).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado al crear cliente.",
		})
	}

	data := Data{Cliente: newCliente}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:		"success",
		Message:	fmt.Sprintf("¡Iniciaste una nueva sesión en la mesa '%s'!", mesa.NombreMesa),
		Data:			data,
	})
}

func Delete(c echo.Context) error {
	db := database.GetDb()
	sesionID := c.Param("id")
	sesion := new(models.Sesiones)

	db.First(&sesion, sesionID)
	if sesion.ID == 0 {
		return c.JSON(http.StatusNotFound, ResponseMessage{
			Status: 	"error",
			Message:	"Sesión no encontrado.",
		})
	}

	now := time.Now()
	sesion.Activo = false
	sesion.FinishedAt = &now

	if err := db.Save(sesion).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado al cerrar la sesión.",
		})
	}
	
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:		"success",
		Message:	"¡Sesión cerrada con éxito!",
	})
}
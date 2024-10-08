package auth

import (
	"bar/database"
	"bar/models"
	"bar/routes/middleware"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type ResponseMessage struct {
	Status  string `json:"status"`
	Data    Data   `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

type Data struct {
	Usuario *models.Usuarios `json:"usuario,omitempty"`
	Login		*LoginRequest		 `json:"login,omitempty"`
	Token		string					 `json:"token,omitempty"`
}

type LoginRequest struct {
	Email 		string 	`json:"email"`
	Password	string	`json:"password"`
}

func Login(c echo.Context) error {
	db := database.GetDb()
	usuario := new(models.Usuarios)
	login := new(LoginRequest)

	if err := c.Bind(&login); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}

	db.Where("email = ?", login.Email).Preload("Rol").First(&usuario)
	if usuario.ID == 0 {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Email no encontrado",
		})
	}
	if login.Password != usuario.Password {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Contraseña incorrecta",
		})
	}

	// Generar el token
	token, err := middleware.GenerarToken(
		usuario.ID,
		usuario.Nombre + " " + usuario.Apellido,
		usuario.Rol.Nombre,
	)
	if err != nil {
		return err
	}

	data := Data{Token: token}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data: data,
	})
}

func Register(c echo.Context) error {
	db := database.GetDb()
	register := new(models.Usuarios)

	if err := c.Bind(&register); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}

	// Buscamos el email en la BBDD
	db.Where("email = ?", register.Email).First(&register)

	// En caso de encontrar un registro el ID sera diferente a 0
	if register.ID != 0 {
		return c.JSON(http.StatusConflict, ResponseMessage{
			Status:		"error",
			Message:	"El email ya está registrado.",
		})
	}

	// Creamos el usuario
	if err := db.Create(&register).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, ResponseMessage{
			Status:		"error",
			Message:	"Error inesperado.",
		})
	}

	// Cargamos el campo 'Rol'
	db.Preload("Rol").First(&register, register.ID)

	// Generar el token
	token, err := middleware.GenerarToken(
		register.ID,
		register.Nombre + " " + register.Apellido,
		register.Rol.Nombre,
	)
	if err != nil {
		return err
	}

	data := Data{Token: token}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data: data,
	})
}

func Restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*middleware.JwtCustomClaims)
	name := claims.Name
	return c.String(http.StatusOK, "Welcome " + name + "!")
}
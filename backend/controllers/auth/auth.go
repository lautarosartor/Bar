package auth

import (
	"bar/database"
	"bar/models"
	"bar/routes/middleware"
	"fmt"
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
}

type LoginRequest struct {
	Email 		string 	`json:"email"`
	Password	string	`json:"password"`
}

func Login(c echo.Context) error {
	db := database.GetDb()
	usuario := new(models.Usuarios)
	login := new(LoginRequest)

	fmt.Println("Datos del request", login)

	if err := c.Bind(&login); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseMessage{
			Status:		"error",
			Message:	"Invalid request body: " + err.Error(),
		})
	}

	db.Where("email = ?", login.Email).Preload("Rol").First(&usuario)
	fmt.Println("usuario encontrado: ", usuario)
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

	return c.JSON(http.StatusOK, echo.Map{
		"token": token,
	})
}

func Restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*middleware.JwtCustomClaims)
	name := claims.Name
	return c.String(http.StatusOK, "Welcome " + name + "!")
}
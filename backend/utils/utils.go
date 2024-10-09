package utils

import (
	"bar/database"
	"bar/models"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"strings"

	extract "github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

// Obtener el ID del usuario activo
func GetUserId(c echo.Context) uint {
	var userID string // Variable para almacenar el ID del usuario

	// Obtener el token de autorización del encabezado de la solicitud
	reqToken := c.Request().Header.Get("Authorization")
	
	// Dividir el token para obtener solo el token Bearer
	splitToken := strings.Split(reqToken, "Bearer ")

	// Asignar el token a la variable reqToken
	reqToken = splitToken[1]

	// Parsear el token sin verificarlo para obtener los claims
	token, _, err := new(extract.Parser).ParseUnverified(reqToken, extract.MapClaims{})
	if err != nil {
		log.Printf("Error %s", err)
	}

	// Comprobar si se pueden obtener los claims del token
	if claims, ok := token.Claims.(extract.MapClaims); ok {
		// Obtener el ID del usuario desde los claims
		subId := fmt.Sprint(claims["id"]) // Convertir el ID a string
		userID = subId                    // Asignar el ID a la variable userID
	}

	// Obtener la conexión a la base de datos
	db := database.GetDb()
	usuario := new(models.Usuarios) // Crear una nueva instancia de Usuario

	// Buscar al usuario en la base de datos por ID
	db.Where("id = ?", userID).First(&usuario)
	
	return usuario.ID // Retornar el ID del usuario encontrado
}

// Si el bool es true retornara el ID del rol, de lo contrario retorna el nombre del rol
func GetUserRole(c echo.Context, id bool) interface{} {
	var userRole string

	reqToken := c.Request().Header.Get("Authorization")
	
	splitToken := strings.Split(reqToken, "Bearer ")

	reqToken = splitToken[1]

	token, _, err := new(extract.Parser).ParseUnverified(reqToken, extract.MapClaims{})
	if err != nil {
		log.Printf("Error %s", err)
	}

	if claims, ok := token.Claims.(extract.MapClaims); ok {
		subRole := fmt.Sprint(claims["role"])
		userRole = subRole
	}

	db := database.GetDb()
	rol := new(models.Roles)

	db.Where("nombre = ?", userRole).First(&rol)
	
	if id {
		return rol.ID
	}

	return rol.Nombre
}

func GenerateRandomCode(length int) string {
	randomBytes := make([]byte, length)
	_, err := rand.Read(randomBytes)
	if err != nil {
		panic(err)
	}
	return base64.StdEncoding.EncodeToString(randomBytes)[:length]
}
package estados

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
	Estados []models.Estados `json:"estados,omitempty"`
}

func GetAll(c echo.Context) error {
	db := database.GetDb()

	var estados []models.Estados

	db.Find(&estados)

	data := Data{Estados: estados,}
	return c.JSON(http.StatusOK, ResponseMessage{
		Status:	"success",
		Data:		data,
	})
}
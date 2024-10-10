package models

import "time"

type Promociones struct {
	ID          	uint       `json:"id" gorm:"primary_key"`
	Titulo 				string     `json:"titulo"`
	Descripcion 	*string    `json:"descripcion"`
	FechaInicio 	time.Time  `json:"fecha_inicio"`
	FechaFin    	time.Time  `json:"fecha_fin"`
	Promocion			*string		 `json:"promocion"`
}

func (Promociones) TableName() string {
	return "promociones"
}

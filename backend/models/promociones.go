package models

import "time"

type Promociones struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	Descripcion string     `json:"descripcion"`
	FechaInicio time.Time  `json:"fecha_inicio"`
	FechaFin    *time.Time `json:"fecha_finalizacion"`
	Porcentaje  *int       `json:"stock"`
}

func (Promociones) TableName() string {
	return "promociones"
}

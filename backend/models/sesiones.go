package models

import "time"

type Sesiones struct {
	ID         uint64    `json:"id" gorm:"primary_key"`
	Idmesa     uint      `json:"idmesa"`
	Activo     bool      `json:"activo"`
	CreatedAt  time.Time `json:"created_at"`
	FinishedAt time.Time `json:"finished_at"`
	Mesa			 *Mesas		 `json:"mesa,omitempty" gorm:"ForeignKey:idmesa;AssociationForeignKey:id"`
}

func (Sesiones) TableName() string {
	return "sesiones"
}

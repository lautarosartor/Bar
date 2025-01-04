package models

import "time"

type Sesiones struct {
	ID         uint       `json:"id" gorm:"primary_key"`
	Idmesa     uint       `json:"idmesa"`
	Idowner    uint       `json:"idowner"`
	Activo     bool       `json:"activo" gorm:"default:true"`
	CreatedAt  time.Time  `json:"created_at"`
	FinishedAt *time.Time `json:"finished_at"`
	Mesa       *Mesas     `json:"mesa,omitempty" gorm:"ForeignKey:idmesa;AssociationForeignKey:id"`
	Owner      *Clientes  `json:"owner,omitempty" gorm:"ForeignKey:idowner;AssociationForeignKey:id"`
}

func (Sesiones) TableName() string {
	return "sesiones"
}

type SesionesClientes struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Idsesion  uint      `json:"idsesion"`
	Idcliente uint      `json:"idcliente"`
	Sesion    *Sesiones `json:"sesion,omitempty" gorm:"ForeignKey:idsesion;AssociationForeignKey:id"`
	Cliente   *Clientes `json:"cliente,omitempty" gorm:"ForeignKey:idcliente;AssociationForeignKey:id"`
}

func (SesionesClientes) TableName() string {
	return "sesiones_clientes"
}

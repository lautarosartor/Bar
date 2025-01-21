package models

import "time"

type Productos struct {
	ID             uint           `json:"id" gorm:"primary_key"`
	Idsubcategoria *uint          `json:"idsubcategoria"`
	Nombre         string         `json:"nombre"`
	Descripcion    *string        `json:"descripcion"`
	Precio         float64        `json:"precio"`
	Stock          int            `json:"stock"`
	ImgUrl         *string        `json:"img_url"`
	CreatedAt      time.Time      `json:"created_at"`
	Subcategoria   *Subcategorias `json:"subcategoria,omitempty" gorm:"ForeignKey:idsubcategoria;AssociationForeignKey:id"`
}

func (Productos) TableName() string {
	return "productos"
}

package models

import "time"

type Productos struct {
	ID          uint    	`json:"id" gorm:"primary_key"`
	Idcategoria *uint   	`json:"idcategoria"`
	Nombre      string  	`json:"nombre"`
	Descripcion *string 	`json:"descripcion"`
	Precio      float64 	`json:"precio"`
	Stock       int    	`json:"stock"`
	ImgUrl      *string 	`json:"img_url"`
	CreatedAt   time.Time `json:"created_at"`
	Categoria		*Categorias	`json:"categoria,omitempty" gorm:"ForeignKey:idcategoria;AssociationForeignKey:id"`
}

func (Productos) TableName() string {
	return "productos"
}

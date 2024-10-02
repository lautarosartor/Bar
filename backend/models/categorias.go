package models

type Categorias struct {
	ID     uint   `json:"id" gorm:"primary_key"`
	Nombre string `json:"nombre"`
}

func (Categorias) TableName() string {
	return "categorias"
}

type Subcategorias struct {
	ID          uint        `json:"id" gorm:"primary_key"`
	Idcategoria uint        `json:"idcategoria"`
	Nombre      string      `json:"nombre"`
	Categoria   *Categorias `json:"categoria,omitempty" gorm:"ForeignKey:idcategoria;AssociationForeignKey:id"`
}

func (Subcategorias) TableName() string {
	return "subcategorias"
}
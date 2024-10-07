package middleware

import (
	"bar/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JwtCustomClaims define los claims personalizados que usaremos en los tokens JWT.
type JwtCustomClaims struct {
	ID		uint	 `json:"id"`
	Name  string `json:"name"`
	Role	string `json:"role"`
	jwt.RegisteredClaims
}

// GenerarToken crea un nuevo token JWT
func GenerarToken(id uint, name, role string) (string, error) {
	claims := &JwtCustomClaims{
		ID: id,
		Name: name,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	config.LoadEnvProps(".env")
	return token.SignedString([]byte(config.GetString("JWT_KEY")))
}

// ValidarToken valida un token JWT y retorna las afirmaciones
func ValidarToken(tokenString string) (*JwtCustomClaims, error) {
	config.LoadEnvProps(".env")
	token, err := jwt.ParseWithClaims(tokenString, &JwtCustomClaims{}, func(token *jwt.Token) (any, error) {
		return []byte(config.GetString("JWT_KEY")), nil
	})

	if claims, ok := token.Claims.(*JwtCustomClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, err
	}
}
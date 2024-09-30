package config

import "github.com/magiconair/properties"

var envProps *properties.Properties

func LoadEnvProps(file string) {
	envProps = properties.MustLoadFile(file, properties.UTF8)
}

func GetString(key string) string {
	return envProps.GetString(key, "")
}

func GetBoolean(key string) bool {
	return envProps.GetString(key, "") == "true"
}
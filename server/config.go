package server

import (
	"github.com/creasty/configo"
)

// Config stores general setting parameters that are loaded from
// enviroment variables, a dotenv file, and yaml files
type Config struct {
	Env  string `valid:"required"`
	Host string `valid:"required"`

	Github struct {
		ClientID     string `envconfig:"client_id" valid:"required"`
		ClientSecret string `envconfig:"client_secret" valid:"required"`
	}
}

// LoadConfig reads configurations
func LoadConfig() (*Config, error) {
	c := &Config{}
	err := configo.Load(c, configo.Option{Dir: "./data/config", DotenvPath: "./.env"})
	if err != nil {
		return nil, err
	}
	return c, nil
}

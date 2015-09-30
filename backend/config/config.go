package config

import (
	"io/ioutil"
	"path"
	"path/filepath"
	"strings"
)

type Config struct {
	Server    *ServerConfig
	configDir string
}

func NewConfig(configDir string) (*Config, error) {
	absoluteConfigDir, err := filepath.Abs(configDir)
	if err != nil {
		return nil, err
	}

	files, err := ioutil.ReadDir(absoluteConfigDir)
	if err != nil {
		return nil, err
	}

	config := Config{
		Server:    NewServerConfig(),
		configDir: absoluteConfigDir,
	}

	for _, file := range files {
		switch {
		case !file.IsDir() && strings.HasPrefix(file.Name(), "server."):
			var err error
			config.Server, err = readServerConfig(path.Join(absoluteConfigDir, file.Name()))
			if err != nil {
				return nil, err
			}
		}
	}

	return &config, nil
}

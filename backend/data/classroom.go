package data

import (
	"crypto/sha256"
	"encoding/base64"
	"strings"
)

type Classroom struct {
	Name     string   `json:"name"`
	Hash     string   `json:"hash"`
	Source   []string `json:"source"`
	Firmware []string `json:"firmware"`
}

func NewClassroom(name string) *Classroom {
	classroom := &Classroom{
		Name:     name,
		Source:   strings.Split(defaultSource, "\n"),
		Firmware: strings.Split(defaultFirmware, "\n"),
	}
	classroom.UpdateHash()
	return classroom
}

func (c *Classroom) UpdateHash() {
	digester := sha256.New()

	for _, line := range c.Source {
		digester.Write([]byte(line))
	}
	for _, line := range c.Firmware {
		digester.Write([]byte(line))
	}
	c.Hash = base64.StdEncoding.EncodeToString(digester.Sum(nil))
}

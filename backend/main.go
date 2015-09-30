package main

import (
	log "github.com/Sirupsen/logrus"
	"github.com/codegangsta/cli"
	"github.com/untoldwind/eightyish/backend/command"
	"os"
)

func main() {
	app := cli.NewApp()
	app.Name = "eightyish"
	app.Usage = "Server backend for eightyish simulator"

	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:  "config-dir",
			Value: "/etc/eightyish.d",
			Usage: "config directory",
		},
	}

	app.Commands = []cli.Command{
		command.ServerCommand,
	}

	if err := app.Run(os.Args); err != nil {
		log.Errorf("Failed to run command: %s", err.Error())
	}
}

package command

import (
	"github.com/codegangsta/cli"
	"github.com/untoldwind/eightyish/backend/server"
)

var ServerCommand cli.Command = cli.Command{
	Name:   "server",
	Usage:  "Start server",
	Action: runWithContext(serverCommand),
}

func serverCommand(ctx *cli.Context, runCtx *runContext) {
	runCtx.server = server.NewServer(runCtx.config.Server, runCtx.store, runCtx.logger)

	if err := runCtx.server.Start(); err != nil {
		runCtx.logger.ErrorErr(err)
		return
	}

	runCtx.handleSignals()
}

package server

import (
	"fmt"
	"github.com/untoldwind/eightyish/backend/config"
	"github.com/untoldwind/eightyish/backend/logging"
	"github.com/untoldwind/routing"
	"net"
	"net/http"
)

type Server struct {
	config   *config.ServerConfig
	listener net.Listener
	logger   logging.Logger
}

func NewServer(config *config.ServerConfig, logger logging.Logger) *Server {
	return &Server{
		config: config,
		logger: logger.WithContext(map[string]interface{}{"package": "server"}),
	}
}

func (s *Server) Start() error {
	ip := net.ParseIP(s.config.BindAddress)

	if ip == nil {
		return fmt.Errorf("Failed to parse IP: %v", s.config.BindAddress)
	}
	bindAddr := &net.TCPAddr{IP: ip, Port: s.config.HttpPort}

	var err error
	s.listener, err = net.Listen(bindAddr.Network(), bindAddr.String())
	if err != nil {
		return err
	}

	go http.Serve(s.listener, makeGzipHandler(s.routeHandler()))

	s.logger.Infof("Started http server on %s", bindAddr.String())
	return nil
}

func (s *Server) Stop() {
	if s.listener != nil {
		s.listener.Close()
	}
}

func (s *Server) routeHandler() http.Handler {
	return routing.NewRouteHandler(
		routing.PrefixSeq("/v1"),
		routing.Any(http.FileServer(http.Dir(s.config.UiDir))),
	)
}

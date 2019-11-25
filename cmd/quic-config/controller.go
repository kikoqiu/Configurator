package main

import (
	"errors"
	"reflect"
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/NotFastEnuf/configurator/pkg/controller"
	serial "github.com/bugst/go-serial"
)

var (
	autoConnect = false
)

type Status struct {
	IsConnected    bool
	Port           string
	AvailablePorts []string
	Info           *controller.TargetInfo
}

func controllerStatus() (*Status, error) {
	ports, err := serial.GetPortsList()
	if err != nil {
		return nil, err
	}
	if fc != nil && len(ports) == 0 {
		closeController()
	}
	if fc == nil && len(ports) != 0 && autoConnect {
		if err := connectFirstController(); err != nil {
			return nil, err
		}
		autoConnect = false
	}

	s := &Status{
		AvailablePorts: ports,
		IsConnected:    fc != nil,
	}
	if fc != nil {
		s.Port = fc.PortName
		s.Info = fc.Info
	}
	return s, nil
}

func closeController() {
	if fc != nil {
		fc.Close()
	}
	fc = nil
}

func connectFirstController() error {
	ports, err := serial.GetPortsList()
	if err != nil {
		return err
	}

	if len(ports) == 0 {
		return errors.New("no controller port found")
	}

	return connectController(ports[len(ports)-1])
}

func connectController(p string) error {
	log.Printf("opening controller %s", p)
	c, err := controller.OpenController(p)
	if err != nil {
		return err
	}
	fc = c

	go func(fc *controller.Controller) {
		log.Warnf("port: %v", <-c.Disconnect)
		log.Printf("closing controller %s", p)
		closeController()
	}(c)

	return nil
}

func watchPorts() {
	for {
		s, err := controllerStatus()
		if err != nil {
			log.Println(err)
			time.Sleep(500 * time.Millisecond)
			continue
		}

		if !reflect.DeepEqual(*s, status) {
			broadcastWebsocket("status", s)
		}
		status = *s
		time.Sleep(500 * time.Millisecond)
	}
}

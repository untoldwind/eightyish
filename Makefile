DEPS = $(shell go list -f '{{range .TestImports}}{{.}} {{end}}' ./backend/...)
PACKAGES = $(shell go list ./...)
VETARGS?=-asmdecl -atomic -bool -buildtags -copylocks -methods \
         -nilfunc -printf -rangeloops -shift -structtags -unsafeptr
DEPPATH = $(firstword $(subst :, , $(GOPATH)))

all: export GOPATH=${PWD}/Godeps/_workspace:${PWD}/../../../..
all: deps format
	@mkdir -p bin/
	@echo "--> Running go build"
	@go build -v -o bin/eightyish github.com/untoldwind/eightyish/backend

deps: export GOPATH=${PWD}/Godeps/_workspace:${PWD}/../../../..
deps:
	@echo "--> Installing build dependencies"
	@go get -d -v ./backend/... $(DEPS)

updatedeps: deps
	@echo "--> Updating build dependencies"
	@go get -d -f -u ./backend/... $(DEPS)

test: export GOPATH=${PWD}/Godeps/_workspace:${PWD}/../../../..
test: deps
	go list ./backend/... | xargs -n1 go test -v
	@$(MAKE) vet

format: export GOPATH=${PWD}/Godeps/_workspace:${PWD}/../../../..
format: deps
	@echo "--> Running go fmt"
	@go fmt ./backend/...

vet: export GOPATH=${PWD}/Godeps/_workspace:${PWD}/../../../..
vet:
	@go tool vet 2>/dev/null ; if [ $$? -eq 3 ]; then \
		go get golang.org/x/tools/cmd/vet; \
	fi
	@echo "--> Running go tool vet $(VETARGS) trader"
	@go tool vet $(VETARGS) backend ; if [ $$? -eq 1 ]; then \
		echo ""; \
		echo "Vet found suspicious constructs. Please check the reported constructs"; \
		echo "and fix them if necessary before submitting the code for reviewal."; \
	fi

genmocks:
	@echo "--> Generate mocks"
	@go build -v -o bin/mockgen github.com/golang/mock/mockgen
	bin/mockgen -source=./backend/logging/logger.go -destination=./backend/logging/logger_mock.go -package logging


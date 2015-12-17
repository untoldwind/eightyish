package server

import (
	"fmt"
	"net/http"
)

type HTTPError struct {
	Status  int
	Message string
}

func (err *HTTPError) Error() string {
	return fmt.Sprintf("HTTP error %d: %s", err.Status, err.Message)
}

func BadRequest(message string) *HTTPError {
	return &HTTPError{
		Status:  http.StatusBadRequest,
		Message: message,
	}
}

func NotFound() *HTTPError {
	return &HTTPError{
		Status:  http.StatusNotFound,
		Message: "Not found",
	}
}

func MethodNotAllowed() *HTTPError {
	return &HTTPError{
		Status:  http.StatusMethodNotAllowed,
		Message: "Method not allowed",
	}
}

func PermissionDenied() *HTTPError {
	return &HTTPError{
		Status:  http.StatusForbidden,
		Message: "Permission denied",
	}
}

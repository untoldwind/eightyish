package server

import (
	"compress/gzip"
	"net/http"
	"strings"
)

type gzipResponseWriter struct {
	http.ResponseWriter
	gzip *gzip.Writer
}

func (w *gzipResponseWriter) Write(b []byte) (int, error) {
	if w.gzip == nil {
		w.gzip = gzip.NewWriter(w.ResponseWriter)
	}
	return w.gzip.Write(b)
}

func (w *gzipResponseWriter) CloseGzip() {
	if w.gzip != nil {
		w.gzip.Close()
	}
}

func makeGzipHandler(handler http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") || r.Header.Get("Upgrade") != "" {
			handler.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Content-Encoding", "gzip")
		gzr := &gzipResponseWriter{ResponseWriter: w}
		defer gzr.CloseGzip()
		handler.ServeHTTP(gzr, r)
	}
}

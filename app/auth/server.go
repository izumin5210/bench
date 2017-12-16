package auth

import (
	"context"
	"errors"

	"github.com/izumin5210/bench/api"
)

type server struct {
}

// New creates an AuthServiceServer instance
func New() api.AuthServiceServer {
	return &server{}
}

func (s *server) GetAuthorizeURL(c context.Context, req *api.Empty) (*api.AuthorizeURLResponse, error) {
	return nil, errors.New("not implemented yet")
}

func (s *server) Callback(c context.Context, req *api.CallbackRequest) (*api.Empty, error) {
	return nil, errors.New("not implemented yet")
}

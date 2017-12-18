package auth

import (
	"context"
	"errors"

	"github.com/izumin5210/bench/api"
	"github.com/izumin5210/bench/domain/auth"
)

type server struct {
	repo auth.Repository
}

// New creates an AuthServiceServer instance
func New(repo auth.Repository) api.AuthServiceServer {
	return &server{
		repo: repo,
	}
}

func (s *server) GetAuthorizeURL(c context.Context, req *api.Empty) (*api.AuthorizeURLResponse, error) {
	return &api.AuthorizeURLResponse{Url: s.repo.GetAuthURL()}, nil
}

func (s *server) Authorize(c context.Context, req *api.AuthorizeRequest) (*api.AccessToken, error) {
	return nil, errors.New("not yet implemented")
}

package infra

import (
	"github.com/izumin5210/bench/domain/auth"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

type authRepo struct {
	config *oauth2.Config
}

func NewAuthRepo(clientID, clientSecret, redirectURL string) auth.Repository {
	return &authRepo{
		config: &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			Endpoint:     github.Endpoint,
			RedirectURL:  redirectURL,
			Scopes:       []string{},
		},
	}
}
func (r *authRepo) GetAuthURL() string {
	url := r.config.AuthCodeURL("state")
	return url
}

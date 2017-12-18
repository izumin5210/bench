package auth

type Repository interface {
	GetAuthURL() string
}

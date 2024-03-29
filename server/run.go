package server

import (
	"context"
	"net"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/soheilhy/cmux"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"github.com/izumin5210/bench/api"
	"github.com/izumin5210/bench/app/auth"
	"github.com/izumin5210/bench/infra"
)

var (
	grpcMatchers = []cmux.Matcher{
		cmux.HTTP2HeaderField("content-type", "application/grpc"),
	}
	gatewayMatchers = []cmux.Matcher{
		cmux.HTTP2(),
		cmux.HTTP1(),
	}
)

// Run starts a gRPC server
func Run(cnf *Config) error {
	lis, err := net.Listen("tcp", cnf.Host)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	mux := cmux.New(lis)

	grpcServer := createGrpcServer(cnf)
	gatewayServer, err := createGatewayServer(ctx, cnf)

	if err != nil {
		return err
	}

	go grpcServer.Serve(mux.Match(grpcMatchers...))
	go http.Serve(mux.Match(gatewayMatchers...), gatewayServer)

	return mux.Serve()
}

func createGrpcServer(cnf *Config) *grpc.Server {
	s := grpc.NewServer()
	api.RegisterAuthServiceServer(s, auth.New(
		infra.NewAuthRepo(cnf.Github.ClientID, cnf.Github.ClientSecret, cnf.Github.RedirectURL),
	))
	reflection.Register(s)
	return s
}

func createGatewayServer(c context.Context, cnf *Config) (http.Handler, error) {
	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{
		grpc.WithInsecure(),
	}
	var err error
	err = api.RegisterAuthServiceHandlerFromEndpoint(c, mux, cnf.Host, opts)
	if err != nil {
		return nil, err
	}
	return mux, nil
}

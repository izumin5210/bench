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
func Run() error {
	lis, err := net.Listen("tcp", ":3000")
	if err != nil {
		return err
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	mux := cmux.New(lis)

	grpcServer := createGrpcServer()
	gatewayServer, err := createGatewayServer(ctx)

	if err != nil {
		return err
	}

	go grpcServer.Serve(mux.Match(grpcMatchers...))
	go http.Serve(mux.Match(gatewayMatchers...), gatewayServer)

	return mux.Serve()
}

func createGrpcServer() *grpc.Server {
	s := grpc.NewServer()
	api.RegisterAuthServiceServer(s, auth.New())
	reflection.Register(s)
	return s
}

func createGatewayServer(c context.Context) (http.Handler, error) {
	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{
		grpc.WithInsecure(),
	}
	var err error
	err = api.RegisterAuthServiceHandlerFromEndpoint(c, mux, ":3000", opts)
	if err != nil {
		return nil, err
	}
	return mux, nil
}

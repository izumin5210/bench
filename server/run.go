package server

import (
	"net"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/soheilhy/cmux"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Run starts a gRPC server
func Run() error {
	lis, err := net.Listen("tcp", ":3000")
	if err != nil {
		return err
	}

	mux := cmux.New(lis)

	go createGrpcServer().Serve(mux.Match(cmux.HTTP2HeaderField("content-type", "application/grpc")))
	go http.Serve(mux.Match(cmux.HTTP2(), cmux.HTTP1()), createGatewayServer())

	return mux.Serve()
}

func createGrpcServer() *grpc.Server {
	s := grpc.NewServer()
	reflection.Register(s)
	return s
}

func createGatewayServer() http.Handler {
	mux := runtime.NewServeMux()
	return mux
}

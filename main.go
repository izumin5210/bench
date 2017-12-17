package main

import (
	"fmt"
	"os"

	"github.com/izumin5210/bench/server"
)

func main() {
	cnf, err := server.LoadConfig()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	if err = server.Run(cnf); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

package main

import (
	"fmt"
	"os"

	"github.com/izumin5210/bench/server"
)

func main() {
	if err := server.Run(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

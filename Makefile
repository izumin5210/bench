.DEFAULT_GOAL := all

BIN := bin/app
SRC_FILES := $(shell git ls-files | grep -E "\.go$$")
GO_BUILD_FLAGS := -v -ldflags="-s -w"

DEP_BIN_DIR := ./vendor/.bin/
DEP_SRCS := \
	github.com/golang/protobuf/protoc-gen-go \
	github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway

DEP_BINS := $(addprefix $(DEP_BIN_DIR),$(notdir $(DEP_SRCS)))

PROTOS := $(wildcard ./api/schema/*.proto)
PROTO_BASENAMES := $(basename $(subst ./api/schema,./api,$(PROTOS)))
PROTO_GO_OUTS := $(addsuffix .pb.go,$(PROTO_BASENAMES))
PROTO_GW_OUTS := $(addsuffix .pb.gw.go,$(PROTO_BASENAMES))

define dep-bin-tmpl
$(eval OUT := $(addprefix $(DEP_BIN_DIR),$(notdir $(1))))
$(OUT): vendor/$(1)
	@echo "Install $(OUT)"
	@cd vendor/$(1) && GOBIN="$(shell pwd)/$(DEP_BIN_DIR)" go install .
endef

define proto-go-out-tmpl
$(eval OUT := $(addsuffix .pb.go,$(basename $(subst ./api/schema,./api,$(1)))))
$(OUT): $(1) $(DEP_BINS)
	@echo "Generate $(OUT)"
	@PATH=$(shell pwd)/$(DEP_BIN_DIR):$$$$PATH protoc \
		-I ./api/schema \
		-I ./vendor/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis/ \
		$(1) \
		--go_out=plugins=grpc:./api
endef

define proto-gw-out-tmpl
$(eval OUT := $(addsuffix .pb.gw.go,$(basename $(subst ./api/schema,./api,$(1)))))
$(OUT): $(1) $(DEP_BINS)
	@echo "Generate $(OUT)"
	@PATH=$(shell pwd)/$(DEP_BIN_DIR):$$$$PATH protoc \
		-I ./api/schema \
		-I ./vendor/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis/ \
		$(1) \
		--grpc-gateway_out=logtostderr=true:./api
endef

$(foreach src,$(DEP_SRCS),$(eval $(call dep-bin-tmpl,$(src))))
$(foreach proto,$(PROTOS),$(eval $(call proto-go-out-tmpl,$(proto))))
$(foreach proto,$(PROTOS),$(eval $(call proto-gw-out-tmpl,$(proto))))

.PHONY: all
all: $(BIN)

.PHONY: run
run: $(BIN)
	@$(BIN)

$(BIN): $(SRC_FILES) $(PROTO_GO_OUTS) $(PROTO_GW_OUTS)
	@echo "Build $@"
	@go build $(GO_BUILD_FLAGS) -o $(BIN) main.go

vendor/%: Gopkg.toml Gopkg.lock
	@dep ensure -v -vendor-only

FROM node:8.9.3-alpine as node
FROM golang:1.9.2-alpine3.6

RUN apk add --no-cache --update \
    ca-certificates \
    openssl \
  && update-ca-certificates


#  glibc (https://github.com/sgerrand/alpine-pkg-glibc)
#-----------------------------------------------
# @see http://qiita.com/tkusumi/items/1668df2fc4cf61a68282
ENV GLIBC_VERSION 2.26-r0
RUN apk add --no-cache --update --virtual .build-deps \
    wget \
  && wget -q -O /etc/apk/keys/sgerrand.rsa.pub \
    https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/$GLIBC_VERSION/sgerrand.rsa.pub \
  && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.26-r0/glibc-$GLIBC_VERSION.apk \
  && apk del .build-deps \
  && apk add glibc-$GLIBC_VERSION.apk


#  Build dependencies
#-----------------------------------------------
RUN apk add --no-cache --update \
    build-base \
    git \
    make \
  && go get -u github.com/derekparker/delve/cmd/dlv \
  && go get -u github.com/golang/lint/golint


#  Node.js
#-----------------------------------------------
COPY --from=node /opt/yarn /opt/yarn
COPY --from=node /usr/local/bin/node /usr/local/bin/
RUN ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn \
  && ln -s /opt/yarn/bin/yarn /usr/local/bin/yarnpkg


#  protobuf
#-----------------------------------------------
ENV PROTOBUF_VERSION 3.4.1
RUN wget -O - https://github.com/google/protobuf/releases/download/v$PROTOBUF_VERSION/protobuf-cpp-$PROTOBUF_VERSION.tar.gz \
  | tar xzf - \
  && cd protobuf-$PROTOBUF_VERSION \
  && ./configure \
  && make -j4 \
  && make install \
  && cd .. \
  && rm -rf protobuf-$PROTOBUF_VERSION


#  dep
#-----------------------------------------------
ENV DEP_VERSION 0.3.2

RUN apk add --no-cache -U --virtual .build-deps \
    curl \
  && curl -fL "https://github.com/golang/dep/releases/download/v$DEP_VERSION/dep-linux-amd64" -o dep \
  && chmod u+x dep \
  && mv ./dep /usr/local/bin/dep \
  && apk del .build-deps


#  Library
#-----------------------------------------------
RUN apk add --no-cache --update \
    bash \
    coreutils \
    openssh-client \
    postgresql \
  && go get -u github.com/derekparker/delve/cmd/dlv \
  && go get -u github.com/golang/lint/golint


#  App
#-----------------------------------------------
ENV APP_DIR /go/src/github.com/izumin5210/bench
ENV PATH $APP_DIR/bin:$PATH
WORKDIR $APP_DIR
RUN ln -sf $APP_DIR /app

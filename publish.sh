#!/bin/bash

sudo rm -rf db

docker build -t olivebranch/geodyssey .

docker push olivebranch/geodyssey

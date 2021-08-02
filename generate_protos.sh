#!/bin/sh
set -e

mkdir -p backend/src/proto/
touch backend/src/proto/__init__.py

find proto -name '*.proto' | protoc -I proto \
  --plugin=protoc-gen-grpc_python=$(which grpc_python_plugin) \
  --include_imports --include_source_info \
  \
  --descriptor_set_out proto/descriptors.pb \
  \
  --python_out=backend/src/proto \
  --grpc_python_out=backend/src/proto \
  \
  $(xargs)

cp proto/descriptors.pb envoy/descriptors.pb

echo "OK"

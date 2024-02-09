#!/bin/sh
set -e
echo 1
find proto -name '*.proto' | protoc -I proto \
  --plugin=protoc-gen-grpc_python=$(which grpc_python_plugin) \
  --include_imports --include_source_info \
  \
  --descriptor_set_out proto/descriptors.pb \
  \
  --python_out=backend/src/proto \
  --grpc_python_out=backend/src/proto \
  \
  --js_out="import_style=commonjs,binary:frontend/src/proto" \
  --grpc-web_out="import_style=commonjs+dts,mode=grpcweb:frontend/src/proto" \
  \
  $(xargs)
echo 2
cp proto/descriptors.pb envoy/descriptors.pb

echo "OK"

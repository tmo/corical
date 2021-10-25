#!/bin/bash

set -e

AWS_S3_BUCKET_NAME=corical.immunisationcoalition.org.au
AWS_CF_DISTRIBUTION_ID=E2I6L1E80YSAO
AWS_PROFILE=corical

echo "Generating protos"
./generate_protos.sh

echo "Building frontend"
pushd frontend/
rm -rf build/
yarn build

AWS_PROFILE=$AWS_PROFILE aws s3 sync build/ s3://$AWS_S3_BUCKET_NAME --delete --acl public-read
AWS_PROFILE=$AWS_PROFILE aws cloudfront create-invalidation --distribution-id $AWS_CF_DISTRIBUTION_ID --paths "/*"

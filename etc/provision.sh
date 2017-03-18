#!/usr/bin/env bash

BIN_PATH="$( dirname $( realpath "${0}" ) )"
PROVISION_PATH="$( realpath "${BIN_PATH}/provision" )"
PROJECT_PATH="$( realpath "${BIN_PATH}/.." )"

cp "${PROJECT_PATH}/.env.example" "${PROJECT_PATH}/.env"
source "${PROJECT_PATH}/.env"

. ${PROVISION_PATH}/system.sh

cd ${PROJECT_PATH}
. ${PROVISION_PATH}/project.sh
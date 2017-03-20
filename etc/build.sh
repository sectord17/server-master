#!/usr/bin/env bash

ETC_PATH="$( dirname $( realpath "${0}" ) )"
PROJECT_PATH="$( realpath "${ETC_PATH}/.." )"

cd ${PROJECT_PATH}

cp .env.example .env
source .env

npm install
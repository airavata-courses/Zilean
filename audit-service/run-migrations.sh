#!/bin/bash

set -a && . ./.env && . ./.env-local
if [ "$1" = "undo" ]; then
    npm run db:migrate:undo
else
    npm run db:migrate
fi
set +a

#!/bin/sh

npm run build

rm -rf venv
npm run python
sudo npm run perms

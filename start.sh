#!/bin/bash

source /root/.bashrc
source /usr/local/rvm/scripts/rvm
source /root/.nvm/nvm.sh
source /root/tibia/web/.env

nvm install 16
rvm use 3.2.2
nvm use 16

ruby -v
node -v

PORT=3030
PID=$(lsof -ti:$PORT)

if [ ! -z "$PID" ]; then
  echo "Killing process on port $PORT"
  sudo kill -9 $PID
fi

sudo chown -R $USER tmp
sudo chown -R $USER public

echo "Run Rails Server"
bundle exec puma

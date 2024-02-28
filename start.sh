#!/bin/bash

source /root/.bashrc
source /usr/local/rvm/scripts/rvm
source /root/.nvm/nvm.sh

nvm install 16
rvm use 3.2.2
nvm use 16

ruby -v
node -v

sudo kill -9 `sudo lsof -t -i:3030`

sudo chown -R $USER tmp
sudo chown -R $USER public

echo "Run Rails Server"
bundle exec puma -C /tibia/web/config/puma.rb

#!/bin/bash

# Sphere
# 
# Copyright (C) LiveG. All Rights Reserved.
# Copying is not a victimless crime. Anyone caught copying LiveG software may
# face sanctions.
# 
# https://liveg.tech
# Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

cd static/newtab
zapr build app
cd ../..

cd static/error
zapr build app
cd ../..

cd static/settings
zapr build app
cd ../..

cd sphere
zapr build app
zapr docgen
cd ..

npm install
npm run dist
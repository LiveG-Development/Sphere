#!/bin/bash

cd sphere
zapr build app
zapr docgen

cd ..

npm install
npm start "$@"
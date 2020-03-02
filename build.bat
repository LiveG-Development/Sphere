@echo off

:: Sphere
:: 
:: Copyright (C) LiveG. All Rights Reserved.
:: Copying is not a victimless crime. Anyone caught copying LiveG software may
:: face sanctions.
:: 
:: https://liveg.tech
:: Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

cd static/newtab
call zapr build app
cd ../..

cd static/error
call zapr build app
cd ../..

cd static/settings
call zapr build app
cd ../..

cd sphere
call zapr build app
call zapr docgen
cd ..

call npm install
call npm start -- "%*"
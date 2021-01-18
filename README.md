# GxpDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.2.

The GPX Dashboard is the frontend webapplication for the GPX System. This dashboard
is used for 
* Creating your account
* Monitoring your power consumption
* Monitoring your group contribution
* configuring your account 
  * Personal settings
  * Meter settings
  * Group settings
  
## Setup environment

Requirements:
* node version 12+
* npm version 6+

Install packages
* run `npm ci`

## Run application

This package has a few commands to make your life easy:
* `npm run start`
    * This will run the app on localhost:4200, requires local API and Nodejs
    to run too for this to work
* `npm run remote-api`
    * This will run the app on localhost:4200, but will use the remote api and
    nodejs. (Note: this will let you develop on production database)
* `npm run build`
    * Build the app
* `npm run build-prod`
    * Build the app with production settings

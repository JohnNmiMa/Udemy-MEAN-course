# MeanCourse

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.6.

## Development frontend server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
The backend package.json file has a bcrypt dependency. You might need to package 'bcryptjs'.
The bcrypt package will need to be compiled on the server where it is installed during npm install time. Some Linux installation don't
give permission to write to /tmp to build bcrypt. Therefore, you will need to download the JavaScript version - bcrypt.js.
And then in the code, use require('bcryptjs');

## Development backend server
Run `cd backend; npm run start:server`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

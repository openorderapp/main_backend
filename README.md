To start this project, please:

``` bash
npm install
```
``` bash
cp config.js.example config.js
```
``` bash
npm run start
```

Example api:
GET http://localhost:3000/customers
- Get all the customers

GET http://localhost:3000/customers/103
- Get customer by specific id

POST http://localhost:3000/customers
- Create a new customer

PUT http://localhost:3000/customers/103
- Update the customer

DELETE http://localhost:3000/customers/103
- Delete the customer

GET http://localhost:3000/employees
- Get all the employees

GET http://localhost:3000/employees/101
- Get employee by specific id

POST http://localhost:3000/employees
- Create a new employee

PUT http://localhost:3000/employees/101
- Update the employee

DELETE http://localhost:3000/employees/101
- Delete the employee
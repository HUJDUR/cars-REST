# CarsREST

CarsREST is an API made for a small imaginary car dealership. 

The API contains records of every car sold in the past year, with user ratings and estimated price.

Actions that the API accepts:
- **GET** reqeust to */api/v1/cars/* -> returns ALL cars
- **GET** request to */api/v1/cars/ID* -> returns the corresponding car with the matching ID
- **POST** request to */api/v1/cars/* -> car creation
- **PATCH** request to */api/v1/cars/ID* -> updating an existing car with the matching ID
- **DELETE** request to */api/v1/cars/ID* -> deleting an existing car with the matching ID

To start using the API, a config.env file needs to be created at the root of the project.

Values required in the file:
- PORT=*Value*
- DATABASE=*MongoDB Connection String*
- DATABASE_PASSWORD=*MongoDB Password*

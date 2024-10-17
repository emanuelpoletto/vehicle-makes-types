# Parser Service for Vehicles Makes and Types

## Description

This is a service that retrieves data from the [Vehicle API](https://vpic.nhtsa.dot.gov/api/) and parses it from XML to JSON.

It is developed with Node.js and NestJS. All the retrieved data is stored in a local SQLite database.

The app can be started either from a terminal or from a Docker container.

## 1. Local setup

### Requirements

- Node.js version >= 16 (according to NestJS docs [here](https://docs.nestjs.com/first-steps#prerequisites))

### Install the dependencies

```bash
$ npm install
```

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Running with Docker

```bash
$ docker compose up
```

## Usage

Currently, you can either get a list of Makes or a single Make, using the respective GraphQL queries as follow below.

### GraphQL Playground

```sh
# Running local
http://localhost:3000/graphql

# Running with Docker
http://localhost:3001/graphql
```

### Example of Get Makes

```gql
query {
  getMakes(skip: 0, take: 10) {
    makes {
      makeId
      makeName
      vehicleTypes {
        typeId
        typeName
      }      
    }
    pagination {
      skip
      take
      count
    }
  }
}
```
Response:
```json
{
  "data": {
    "getMakes": {
      "makes": [
        {
          "makeId": 440,
          "makeName": "ASTON MARTIN",
          "vehicleTypes": [
            {
              "typeId": 2,
              "typeName": "Passenger Car"
            },
            {
              "typeId": 7,
              "typeName": "Multipurpose Passenger Vehicle (MPV)"
            }
          ]
        },
        {
          "makeId": 441,
          "makeName": "TESLA",
          "vehicleTypes": [
            {
              "typeId": 2,
              "typeName": "Passenger Car"
            },
            {
              "typeId": 3,
              "typeName": "Truck"
            },
            {
              "typeId": 7,
              "typeName": "Multipurpose Passenger Vehicle (MPV)"
            }
          ]
        },
        {
          "makeId": 442,
          "makeName": "JAGUAR",
          "vehicleTypes": [
            {
              "typeId": 2,
              "typeName": "Passenger Car"
            },
            {
              "typeId": 7,
              "typeName": "Multipurpose Passenger Vehicle (MPV)"
            }
          ]
        },
        {
          "makeId": 443,
          "makeName": "MASERATI",
          "vehicleTypes": [
            {
              "typeId": 2,
              "typeName": "Passenger Car"
            },
            {
              "typeId": 7,
              "typeName": "Multipurpose Passenger Vehicle (MPV)"
            }
          ]
        },
        {
          "makeId": 444,
          "makeName": "LAND ROVER",
          "vehicleTypes": [
            {
              "typeId": 7,
              "typeName": "Multipurpose Passenger Vehicle (MPV)"
            }
          ]
        },
        {
          "makeId": 445,
          "makeName": "ROLLS-ROYCE",
          "vehicleTypes": [
            {
              "typeId": 2,
              "typeName": "Passenger Car"
            },
            {
              "typeId": 7,
              "typeName": "Multipurpose Passenger Vehicle (MPV)"
            }
          ]
        },
        {
          "makeId": 446,
          "makeName": "BUELL (EBR)",
          "vehicleTypes": [
            {
              "typeId": 1,
              "typeName": "Motorcycle"
            }
          ]
        },
        {
          "makeId": 447,
          "makeName": "JIALING",
          "vehicleTypes": [
            {
              "typeId": 1,
              "typeName": "Motorcycle"
            }
          ]
        },
        {
          "makeId": 448,
          "makeName": "TOYOTA",
          "vehicleTypes": [
            {
              "typeId": 2,
              "typeName": "Passenger Car"
            },
            {
              "typeId": 3,
              "typeName": "Truck"
            },
            {
              "typeId": 7,
              "typeName": "Multipurpose Passenger Vehicle (MPV)"
            }
          ]
        },
        {
          "makeId": 449,
          "makeName": "MERCEDES-BENZ",
          "vehicleTypes": [
            {
              "typeId": 2,
              "typeName": "Passenger Car"
            },
            {
              "typeId": 3,
              "typeName": "Truck"
            },
            {
              "typeId": 5,
              "typeName": "Bus"
            },
            {
              "typeId": 7,
              "typeName": "Multipurpose Passenger Vehicle (MPV)"
            },
            {
              "typeId": 10,
              "typeName": "Incomplete Vehicle"
            }
          ]
        }
      ],
      "pagination": {
        "skip": 0,
        "take": 10,
        "count": 11565
      }
    }
  }
}
```

### Example of Get Make:

```gql
query {
  getMake(id: 452) {
    makeId
    makeName
    vehicleTypes {
      typeId
      typeName
    }
  }
}
```
Response:
```json
{
  "data": {
    "getMake": {
      "makeId": 452,
      "makeName": "BMW",
      "vehicleTypes": [
        {
          "typeId": 1,
          "typeName": "Motorcycle"
        },
        {
          "typeId": 2,
          "typeName": "Passenger Car"
        },
        {
          "typeId": 7,
          "typeName": "Multipurpose Passenger Vehicle (MPV)"
        }
      ]
    }
  }
}
```

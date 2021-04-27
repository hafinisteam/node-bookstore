# BookStore API server

## Installation

1. Install Mongod 

```https://docs.mongodb.com/manual/installation/```

2. Create folder `mongodb-data` whenever you want

3. Run `mongod` with your `mongodb-data` path

```~/mongodb/bin/mongod --dbpath=FOLDER_PATH/mongodb-data```

4. Install package first

```yarn start```

5. Create `.env` file inside folder

```
SESSION_SECRET=hafinisteam
PORT=8001
JWT_EXPIRATION=24h
MONGO_URI=mongodb://127.0.0.1:27017/node-bookstore
```

6. Run server

``` yarn dev```

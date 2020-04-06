# SEN Backend : Progaramming Club

## For Development

- You need Node & Yarn to run this application. Download them here - [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com).

- You will need to set the database host url in a new .env file to the url you are hosting the database server on.

- An example .env file will look like this:

  ```bash
    EMAIL = ""
    PASSWORD = ""
    URL = "http://localhost:5000/"
    SECRET_KEY = ""
    LOGIN_PAGE = "http://localhost:3000/login"
    DATABASE_STRING = "mongodb://localhost:27017/programming-club"
  ```

- To run the server run the following commands in the directory of sen-backend:

  ``` bash
   yarn 
   yarn start
  ```
- For fatching updates 

  ``` bash
   git pull 
   yarn 
  ```

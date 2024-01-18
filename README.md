
# CRUD And Authentication Users NodeJS on Serverless Framework Node HTTP API on AWS

This is a base project for user authentication, connection validation and also logout, likewise, it has some permissions modules according to the user to access the CRUD by assigning, such as the administrator, manager or programmer.

On the other hand, the project was created in the NodeJS programming language, supported by the non-relational database DynamoDB from AW and is designed to make use of the Serverless Framework Node HTTP API on AWS.

## Usage

### Clone the Repository


To clone the repository, run the following command from your terminal

```bash
$ git clone https://github.com/amcdvg/Crud_Autentication_users_NodeJS_Project.git
```



### Install NodeJS Packages

To use this project, you should install Node package , run the following command from your terminal

```bash
cd "nodeJs (CRUD and Authentication User)"
npm install
```


### Create tables in DynamoDB on AWS

In the structure of the project we find a folder called data, if you enter this folder, you will find scripts in nodeJS to create each of the tables for this example, which is configured in your AWS cloud, you can configure it in the code fragment:

```bash
...
AWS.config.update({
  region: 'us-east-1',  // Reemplaza con tu región de AWS
  accessKeyId: 'TU_ACCESS_KEY_ID',  // Reemplaza con tu access key ID
  secretAccessKey: 'TU_SECRET_ACCESS_KEY',  // Reemplaza con tu secret access key
});
....
```
Then we execute the scripts from the console, like this:

```bash

node nameScripts.js

```

### Serverless Framework on AWS

Once the tables are created in DynamoDB AWS, we need to create the lambdas functions and the Gateway APIs, to do this we execute the following command from our console:

```bash
Serverless deploy --verbose

```

### Environment Variables

For this project we have environment variables that will be used to create the user validation tonkens, in the .env file, you can modify them according to your needs, in this example we find the following environment variables:

```bash
JWT_SECRET_KEY=UnaClaveSecretaMuySegura123!#@$
JWT_TIME_SESSION=60s
JWT_TIME_COOKIE=60
```

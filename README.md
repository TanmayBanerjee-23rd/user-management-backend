# user-management-backend

A backend application using NodeJs, ExpressJs wrapped around graphql server and PostgreSQL as a database layer used for creating API's that would serve user management purposes.

# NOTES

## This project was intentionally named as user-management instead so as to keep terminology generic and make it reusable for alternatives such as <'employee' || 'student'>-management

## STEPS TO RUN THE SERVER

## RUN below PostgreSQL query in your query console of postgreSQL database

CREATE TABLE "User" (
"id" SERIAL PRIMARY KEY,
"cell" VARCHAR(255),
"dob" TIMESTAMP,
"age" INTEGER,
"email" VARCHAR(255) NOT NULL UNIQUE,
"gender" VARCHAR(50),
"locationCity" VARCHAR(255),
"locationCountry" VARCHAR(255),
"locationPostcode" INTEGER,
"locationState" VARCHAR(255),
"locationStreetNumber" INTEGER,
"locationStreetName" VARCHAR(255),
"loginUuid" VARCHAR(255) NOT NULL UNIQUE,
"nameTitle" VARCHAR(50),
"nameFirst" VARCHAR(255),
"nameLast" VARCHAR(255),
"pictureLarge" VARCHAR(255),
"registeredDate" TIMESTAMP,
"registeredAge" INTEGER,
"role" VARCHAR(50) NOT NULL DEFAULT 'employee',
"password" VARCHAR(255) NOT NULL
);

## Create a admin user record using below query

INSERT INTO "User" (
"email",
"loginUuid",
"role",
"password",
"cell",
"dob",
"age",
"gender",
"locationCity",
"locationCountry",
"locationPostcode",
"locationState",
"locationStreetNumber",
"locationStreetName",
"nameTitle",
"nameFirst",
"nameLast",
"pictureLarge",
"registeredDate",
"registeredAge"
) VALUES (
'admin@admin.com',
'uuid-1234-5678-90ab-cdef',
'admin',
'$2a$12$QI5IvIEzGw1MSItupwzz9.u/1MvkNMeyoA7tcSN6dqPw/wIDrCiNK',
'1234567890',
'1990-01-01',
35,
'male',
'New York',
'USA',
10001,
'NY',
123,
'Main St',
'Mr',
'Admin',
'Administrator',
'https://example.com/john_doe.jpg',
'2025-05-24',
0
);

### Clone the repository and change your directory to 'user-management-backend

### RUN 'npm i' to install all the dependencies.

### CREATE .env file in the current directory and add DATABASE_URL variable with postgreSQL connection string

### RUN 'prisma generate'

### RUN 'node ./server.js'

# Please find the Queries and Mutations being served by the server in schema.graphql file.

# Use below mutation to get admin access. Though it is accessible to all roles.

mutation {
login(email: "admin@admin.com", password: "password1234") {
token
user {
id
email
role
}
}
}

# Use above admin token as bearer token to run below mutations (addEmployee, updateEmployee ) and query (employees) as they are only accessible to 'admin' user role.

mutation {
addEmployee(input: {
cell: "1234567890"
dob: "1996-05-23T23:07:35.080Z"
age: 35
email: "newemployee@example.com"
gender: "male"
locationCity: "New York"
locationCountry: "USA"
locationPostcode: 10001
locationState: "NY"
locationStreetNumber: 123
locationStreetName: "Main St"
loginUuid: "uuid-1234-5678-90ab-cdef"
nameTitle: "Mr"
nameFirst: "Tanmay"
nameLast: "Banerjee"
pictureLarge: "https://randomuser.me/api/portraits/men/31.jpg"
registeredDate: "2000-01-24T23:07:35.080Z"
registeredAge: 25
role: "admin"
password: "pass1234"
}) {
id
email
name {
first
last
}
role
}
}

mutation {
updateEmployee(uuid: "asdas-asdjaksd-asoska1223saf", input: {
cell: "384683274"
}) {
id
email
name {
first
last
}
role
}
}

query {
employees(filter: { locationCity: "New York" }, page: 1, limit: 10) {
id
email
location {
city
}
}
}

# Below query (employee) is accessible by all roles.

query {
employee(uuid: "employee-uuid") {
id
email
name {
first
last
}
}
}

# Performance Optimizations that can be considered are as ::

## We can optimize database queries, for instance we can select specific fields for employees query.

## We can monitor slow queries using EXPLAIN and SHOW WARNINGS clauses and use indexes on filter columns to speed up query execution.

## We can ensure to fetch all required data in a single query using Prisma's include and thus avoiding over querying

## We can implement caching strategies like in-memory or apollo server caching using the @cacheControl directive.

## We can improve on Database architecture to enable horizontal scaling

## We should do regular monitoring and required profiling using tools provided by Apollo Server plugins ApolloServerPluginUsageReporting.

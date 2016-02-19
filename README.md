# ESTR Evaluation App API

RethinkDB environment variables for database connection:
``ESTR_API_DB_HOST``
``ESTR_API_DB_PORT``

Key for signing JSON web token: 
``ESTR_API_TOKEN_KEY``

## Authentication

All routes require a token obtained after successfully authenticating with the API as follows:
 
```
POST http://hostname:port/api/authenticate
{
	"username" : "chuckNorris",
	"password" : "password123"
} 
```

If your credentials are correct, the response will contain the token:

```
200 OK
{
  "message": "success",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InN0ZXZlMiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE0NTQ2NDgwNzgsImV4cCI6MTQ1NDY5MTI3OH0.02e-AVwszPBKMp-78ubmnujkmkKk1Rov1LCYM09m4sY"
}
```

This token must be passed in an `api-token` header with any subsequent requests to the API.

## Routes

These routes require a valid token be present in the `api-token` header.

###Evaluation
####Create

`POST /evaluations`

Create an evaluation. 
Example request:

```
POST http://hostname:port/api/evaluations
{
	"name": "ENGL 1000",
	"createdBy": "5c34097f-464d-47c0-9762-5d0f124450cd",
	"resultsAvailableDate": "2016-01-29T05:32:18.665Z",
	"isAnonymous": true,
	"questions": []
}
```

Response: 

```
200 OK
{
   "id" : "bc95940f-084c-48c5-b9fe-dc0a82f380b6" 
}
```

####Retrieve all

`GET /evaluations`

Retrieve all evaluations. 
Example request:

```
GET http://hostname:port/api/evaluations
```

Response:

```javascript
200 OK
{
    {
		"id" : "bc95940f-084c-48c5-b9fe-dc0a82f380b6"
		"name": "ENGL 1000",
		"createdBy": "5c34097f-464d-47c0-9762-5d0f124450cd",
		"resultsAvailableDate": "2016-01-29T05:32:18.665Z",
		"isAnonymous": true,
		"status": Created,
		"questions": []
	},
	{
		...
	}
}
 ```

####Retrieve one 

`GET /evaluations/:id`

Retrieve an evaluation. 
Example request:

```
GET http://hostname:port/api/evaluations/bc95940f-084c-48c5-b9fe-dc0a82f380b6
```

Response:

```javascript
200 OK
{
	"id" : "bc95940f-084c-48c5-b9fe-dc0a82f380b6"
	"name": "ENGL 1000",
	"createdBy": "5c34097f-464d-47c0-9762-5d0f124450cd",
	"resultsAvailableDate": "2016-01-29T05:32:18.665Z",
	"isAnonymous": true,
	"status": Published,
	"questions": []
}
 ```

`PUT /evaluations/:id`

####Update

Update an evaluation that has not yet been published. 
Example request:

```javascript
PUT http://hostname:port/api/evaluations/:bc95940f-084c-48c5-b9fe-dc0a82f380b6
{
	"name": "ENGL 1010",
	"createdBy": "5c34097f-464d-47c0-9762-5d0f124450cd",
	"resultsAvailableDate": "2016-01-29T05:32:18.665Z",
	"isAnonymous": false,
	"status": published,
	"questions": [
	  {
	    "text" : "How much do you like pizza?",
	    "audioPath" : ".....",
	    "type" : "faces"
	  },
	  {
        "text" : "How much do you like cake?",
        "audioPath" : ".....",
        "type" : "descriptive"
      }]
	  
}
```

Response:

```
200 OK
{
   "id" : "bc95940f-084c-48c5-b9fe-dc0a82f380b6" 
}
```

####Delete

`DELETE /evaluations/:id`

Delete an evaluation by the current user that has not yet been published.

Example request:

```javascript
DELETE http://hostname:port/api/evaluations/:abc1232f-084c-48c5-b9fe-dc0a82f380b6
{
	"username" : "5c34097f-464d-47c0-9762-5d0f124450cd"
}
```

Response:

```
200 OK
{
	"deleted" : "bc95940f-084c-48c5-b9fe-dc0a82f380b6"
}
```

###Account
####Create

`POST /accounts`

Create a user account. May only be performed by an administrator.
Example request:

```
POST http://hostname:port/api/accounts
{
    "username" : "obi-wan-kenobi",
    "password" : "youremyonlyhope",
    "isAdmin" : false
}
```

Response: 

```
200 OK
{
  "username": "obi-wan-kenobi"
}
```

####Retrieve all

`GET /accounts`

Retrieve all user accounts. May only be performed by an administrator. 
Example request:

```
GET http://hostname:port/api/accounts
```

Response:

```javascript
200 OK
[
  {
    "id": "b7e7ce17-4769-459d-8aff-e823f4051124",
    "isAdmin": true,
    "username": "steve"
  },
  ...
]
 ```

####Retrieve one 

`GET /accounts/:username`

Retrieve an account. May only be performed by an administrator or the user being retrieved.
Example request:

```
GET http://hostname:port/api/accounts/bob
```

Response:

```javascript
200 OK
{
	{
        "id": "b7e7ce17-4729-459d-8aff-e823f4021124",
        "isAdmin": false,
        "username": "bob"
      }
}
 ```

`PUT /evaluations/:id`

####Update

Update an account. May only be performed by an administrator or by the user being updated. Only an administrator may change the account's level of permissions.
Example request:

```javascript
PUT http://hostname:port/api/accounts/bob
{
    "username" : "bob",
    "password" : "newpassword",
    "isAdmin" : false
}
```

Response:

```
200 OK
{
   "username" : "bob" 
}
```

####Delete

`DELETE /accounts/:id`

Delete an account. May only be performed by an administrator.

Example request:

```javascript
DELETE http://hostname:port/api/accounts/bob
{
	"username" : "5c34097f-464d-47c0-9762-5d0f124450cd"
}
```

Response:

```
200 OK
{
	"deleted" : "bob"
}
```

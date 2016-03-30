[![Build Status](https://travis-ci.org/ESTR-eval-app/estr-eval-app-api.svg?branch=master)](https://travis-ci.org/ESTR-eval-app/estr-eval-app-api)

# ESTR Evaluation App API

RethinkDB environment variables for database connection:
``ESTR_API_DB_HOST``
``ESTR_API_DB_PORT``

Key for signing JSON web token: 
``ESTR_API_TOKEN_KEY``

## Email Notifications

The server checks periodically for evaluations that have a "Results Available" date that has passed, and sets them as "Finished". When an evaluation's status is changed to finished, the server sends a notification email to the user's email address to let them know that results are available.

The server uses Nodemailer `https://github.com/nodemailer/nodemailer` to access a Gmail account defined in the server config and send notification emails to the address for the user that created the evaluation. 

The following environment variables are required:

``EVAL_N_NOTIFY_ENABLE`` - true to enable email notifications, false otherwise

``EVAL_N_GMAIL_ACCT`` - gmail account from which notifications should be sent. ex) bob@gmail.com

``EVAL_N_GMAIL_PW`` - gmail account password

``EVAL_N_WEB_URL`` - URL for the Eval n admin web application. Included in notification emails.

When the server starts, it checks whether notifications are enabled, if configuration variables are set correctly, and attempts to send itself a test email. If the test email fails, notifications are disabled and a message is shown in the log.

While the server is running with notifications enabled, the email notification service will send a notification when an evaluation's status is changed to "Finished".

## Question Audio

Eval n allows administrators/evaluation facilitators to optionally upload an audio file for a question when it is created. When completing the evaluation, participants can choose to play the audio recording while reading a question.

Audio files uploaded in the admin web app are sent to the server using a call to the API (See "Question Audio" under "API Routes" below). The server saves audio files it received through the API in an "Audio" directory it creates when it first starts. If the directory does not exist, it will be created. 
Files are renamed according the the evaluation ID and question number, and served from `/audio`. Questions are also updated with the path of the correct audio file on the server to be played in the client apps.

The server periodically checks that all files in the audio directory are associated with an evaluation and question, deleting them otherwise.

## API Authentication

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

## API Routes

###Evaluation
####Create

Requires a valid token be present in the `api-token` header.

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

Requires a valid token be present in the `api-token` header.

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
	    "type" : "Faces"
	  },
	  {
        "text" : "How much do you like cake?",
        "audioPath" : ".....",
        "type" : "Descriptive"
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

Requires a valid token be present in the `api-token` header.

`DELETE /evaluations/:id`

Delete an evaluation by the current user that has not yet been published.

Example request:

```javascript
DELETE http://hostname:port/api/evaluations/:abc1232f-084c-48c5-b9fe-dc0a82f380b6
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

Requires a valid token be present in the `api-token` header.

`POST /accounts`

Create a user account. May only be performed by an administrator.
Example request:

```
POST http://hostname:port/api/accounts
{
    "username" : "obi-wan-kenobi",
    "password" : "youremyonlyhope",
    "isAdmin" : false,
    "email" : "ben@jedi.com"
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

Requires a valid token be present in the `api-token` header.

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

Requires a valid token be present in the `api-token` header.

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

Requires a valid token be present in the `api-token` header.

Update an account. May only be performed by an administrator or by the user being updated. Only an administrator may change the account's level of permissions.
Example request:

```javascript
PUT http://hostname:port/api/accounts/bob
{
    "username" : "bob",
    "password" : "newpassword",
    "isAdmin" : false,
    "email" : "ben@jedi.com"
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

Requires a valid token be present in the `api-token` header.

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

###Response
####Create

`POST /accounts`

Creates an evaluation response record. Optionally include a participant's name.
Example request:

```
POST http://hostname:port/api/responses
{
    "evaluationId" : "bc95940f-084c-48c5-b9fe-dc0a82f380b6",
    "questionResponses" : 
    [
        3,
        "This is super cool!",
        6 
    ],
    "name" : "Bob"
}
```

Response: 

```
200 OK
{
  "message": "success"
}
```

###Result
####Retrieve By Evaluation Id

`GET /evaluations/:evaluationId/results`

Retrieves results for an evaluation, if it has finished.
Example request:

```
GET http://hostname:port/api/evaluations/06fde6a5-56eb-4d75-a1c4-eed2c113dc85/results
```

Response:

```javascript
200 OK
{
  "evaluationId": "06fde6a5-56eb-4d75-a1c4-eed2c113dc85",
  "numResponses": 22
  "responsesStartDate": "2016-01-26T09:20:59.312Z",
  "responsesEndDate": "2016-01-29T05:32:18.665Z",
  "responseCounts": [
    {
      "question": "0",
      "responses": {
        "1": 3,
        "2": 5,
        "3": 7,
        "4": 4,
        "NA": 3
      }
    },
    {
      "question": "1",
      "responses": {
        "1": 3,
        "2": 5,
        "3": 7,
        "4": 4,
        "NA": 3
      }
    }
  ]
  "qualitativeResponses": [
    {
      "question": 6,
      "responses": [
        {
          "text": "I'd have preferred it if there was more cake.",
          "name": "Bob"
        },
        {
          "response": "I thought the instructor was super cool!",
          "name": "Sally"
        }
      ]
    },
    {
      "question": 7,
      "responses": [
        {
          "text": "Awesome",
          "name": "Bob"
        },
        {
          "response": "Neat-o",
          "name": "Sally"
        }
      ]
    }
  ]
}
 ```

###Question Audio
####Upload
 
 `POST /evaluations/:evaluationId/questionAudio/:id`
 
 Add an audio file for a question. Requires the evaluation's id and the question's id. Currently limited to mp3 files less than 3MB.
 Example request:
 
 ```
 POST http://hostname:port/api/evaluations/06fde6a5-56eb-4d75-a1c4-eed2c113dc85/questionAudio/0
 Content-Type audio/mp3
 ```
 
 Response:
 
```
200 OK
{
    "message" : "stored successfully",
    "uri" : "http://hostname:port/content/06fde6a5-56eb-4d75-a1c4-eed2c113dc85_q_0.mp3",
}
```

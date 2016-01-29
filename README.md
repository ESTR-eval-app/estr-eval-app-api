# ESTR Evaluation App API

RethinkDB environment variables for database connection:
``ESTR_API_DB_HOST``
``ESTR_API_DB_PORT``

## Routes

###Evaluation

These routes require authentication.


####Create

`POST /evaluations`

Create an evaluation. 
Example request:

```
POST http://hostname:8081/api/evaluations
{
	"name": "ENGL 1000",
	"createdBy": "5c34097f-464d-47c0-9762-5d0f124450cd",
	"resultsAvailableDate": "2016-01-29T05:32:18.665Z",
	"isAnonymous": true,
	"isPublished": true,
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

####Retrieve

`GET /evaluations/:id`

Retrieve an evaluation. 
Example request:

```
GET http://hostname:8081/api/evaluations/bc95940f-084c-48c5-b9fe-dc0a82f380b6
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
	"isPublished": true,
	"questions": []
}
 ```

`PUT /evaluations/:id`

####Update

Update an evaluation that has not yet been published. 
Example request:

```javascript
PUT http://hostname:8081/api/evaluations/:bc95940f-084c-48c5-b9fe-dc0a82f380b6
{
	"name": "ENGL 1010",
	"createdBy": "5c34097f-464d-47c0-9762-5d0f124450cd",
	"resultsAvailableDate": "2016-01-29T05:32:18.665Z",
	"isAnonymous": false,
	"isPublished": true,
	"questions": []
}
```

Response:

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
DELETE http://hostname:8081/api/evaluations/:abc1232f-084c-48c5-b9fe-dc0a82f380b6
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
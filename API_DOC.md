# Chatting Apps

## Endpoints :

List of available endpoints:

## USER ROUTE - MAIN ENTITY

- `POST /register`
- `POST /login`

below this to access need `authentication`
- `GET /users/search?`
- `POST /users/:idFriend/add-friend?`


## CONVERSATION ROUTE - MAIN ENTITY
below this to access need `authentication`
- `GET /conversations`
- `POST /conversations/:receiverId`

## FRIEND ROUTE - SUPPORT ENTITY
below this to access need `authentication`
- `GET /friends`
- `DELETE /friends/:friendId`

## MESSAGE ROUTE
below this to access need `authentication`
- `GET /conversations/:conversationId/messages`
- `POST //conversations/:conversationId/messages/:receiverId`

## PROFIULE ROUTE
below this to access need `authentication`
- `GET /profiles`
- `POST /profiles`
- `PUT /profiles`
- `PATCH /profiles/update-bio`
- `PATCH /profiles/upload-img`

&nbsp;

## 1. POST /register

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email and Password are required"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Email cannot be empty"
}
OR
{
  "message": "Password cannot be empty"
}
OR
{
  "message": "Password must be at least 5 characters long"
}
```


&nbsp;

## 2. POST /login

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email and Password are required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email/password"
}
```


&nbsp;

## 3. POST /conversation/:receiverId

Description:
- add conversation to database

Request:

- headers: 

```json
{
  "authorization": "Bearer <token>"
}
```

_Response (200 - OK)_

```json
[
  
 {
    "message": "Add Conversation Success",
}
  
]
```

_Response (201 - CREATE)_

```json
[
  
 {
    "id": "integer",
    "senderId": "integer",
    "receiverId": "integer"
}
  
]
```

_Response (400 - Bad Request)_

```json
{
    "message": "You've added to the conversation with him."
}
```

_Response (401 - Unauthorized)_

```json
{
    "message": "you're not friends with the recipient yet"
}
```

&nbsp;

## 4. GET /conversations

Description:
- get conversation from database

Request:

- headers:

```json
{
  "authorization": "Bearer <token>"
}
```


_Response (200 - OK)_

```json
[
  
 {
    "conversationId": "integer",
}
  
]
```

## 5. GET /profiles

Description:
- get profile from database

Request:

- headers:

```json
{
  "authorization": "Bearer <token>"
}
```


_Response (200 - OK)_

```json
[
  
 {
    "userId": "integer",
}
  
]
```

## 6. POST /profiles

Description:
- add profile from database

Request:

- headers:

```json
{
  "authorization": "Bearer <token>"
}
```


_Response (200 - OK)_

```json

[

 {
    "userId"   : "integer",
    "fullName" : "string",
    "address"  : "string",
    "bio"      : "string",
  
}

]
```

## 7. PUT /profiles

Description:
- add profile from database

Request:

- headers:

```json
{
  "authorization": "Bearer <token>"
}
```


_Response (200 - OK)_

```json

[

 {
    "message"   : "Update Profile Success",
  
}

]
```

## 8. GET /friends

Description:
- get friends from database

Request:

- headers:

```json
{
  "authorization": "Bearer <token>"
}
```


_Response (200 - OK)_

```json

[
    {
        "id": "integer",
        "userId": "integer",
        "friendId": "integer",
        "FriendUser": {
            "id": "integer",
            "username": "string"
        }
    },
]
```

## 9. DELETE /friends

Description:
- Delete friends from database

Request:

- headers:

```json
{
  "authorization": "Bearer <token>"
}
```


_Response (204 - OK)_

```json

[
    {
        "message": "Delete Successfully",
    },
]
```


## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```
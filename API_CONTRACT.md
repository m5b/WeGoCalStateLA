# API Contract

Base URL: `/api`

All responses are JSON.

## 1. Response Format (JSend)

### Success

```json
{
  "status": "success",
  "data": { ... }
}
```

### Fail

```json
{
  "status": "fail",
  "data": {
    "fieldOrContext": "Explanation of what went wrong"
  },
  "message": "Message explaning what went wrong" //(optional)
}
```

### Fail due to validation

```json
{
  "status": "fail",
  "data": {
    "_global": "Explantion of what goes wrong globaly, it could be a structure error, additon json field and etc" // could be a list
    "fieldOrContext": "Explanation of what went wrong" // could be a list
  },
  "message": "Validation Error" //(optional)
}
```

### Error(only handle INTERNAL_SERVER_ERROR)

```json
{
  "status": "error",
  "message": "error message"
}
```

## 2. Authentication

### 2.1 JWT Cookie

#### On successful authication, the server sets:

- Name: auth-token

- Type: JWT

- HttpOnly: true

- Secure: true (in production)

- SameSite = LAX (more information check [this](https://stackoverflow.com/a/59995877))
- Path: /

#### Frontend:

- Set up the .env file in /server. **Note: Must set the correct CLIENT_URL_DEV in the server .env file.**
- Doe not set or read the token
- Relies on browser handling cookies
- Must send credentials: "include" on cross-origin requests.
- Example:

```js
fetch("/api/users/me", {
  method: "GET",
  credentials: "include",
});
```

## Auth Endpoints

### 3.1 POST /auth/signup

#### **Behavior**

password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (5 - 21)

#### **Request**

```json
{
  "email": "a@gmail.com",
  "password": "123456778"
}
```

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "auth": "User created"
  }
}
```

##### 409 Conflict

```json
{
  "status": "fail",
  "data": {
    "email": "Email already taken"
  }
}
```

### 3.2 POST /auth/login

#### **Behavior**

Login by local, afterware the response will assign a cookie which contain the jwt token for authication

#### **Request**

```json
{
  "email": "a@gmail.com",
  "password": "123456778"
}
```

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "auth": "authentication acquired"
  }
}
```

##### 404 Not Found

```json
{
  "status": "fail",
  "data": {
    "email": "Can not found the user of the given email"
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "password": "Unmatch password"
  }
}
```

### 3.3 GET /auth/google

#### **Behavior**

Login by google, afterware the response will assign a cookie which contain the jwt token for authication

#### **Request**

- No body
- Please set up .env for redicting to frontend page

#### **Response**

No Response body

## 4. User Endpoints

### 4.1 GET /auth/google

#### **Auth**

auth-token required, handle by browser

#### **Behavior**

Get current user's resource

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "user": {
      "userId": 30001,
      "username": "undisturbed-str",
      "displayName": "undisturbed-str",
      "email": "a@gmail.com",
      "createdAt": "2025-11-09T08:24:17.000Z",
      "updatedAt": "2025-11-09T08:24:17.000Z"
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

### 4.2 PATCH /user/me

#### **Auth**

auth-token required, handle by browser

#### **Behavior**

modify current current user's resource. As right now, only user's display name are changeable, thing like email we need do authication for that, in the future, we can add more modifiable field

#### **Request**

Allowed fields(atlease one field has to be defined)

```json
{
  "displayName": "string, optional, 5-21 chars"
}
```

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "user": {
      "userId": 30001,
      "username": "undisturbed-str",
      "displayName": "undisturbed-str",
      "email": "a@gmail.com",
      "createdAt": "2025-11-09T08:24:17.000Z",
      "updatedAt": "2025-11-09T08:24:17.000Z"
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

##### 404 Not Found

```json
{
  "status": "fail",
  "data": null,
  "message": "Can not found current user given the token"
}
```

### 4.3 DELETE /user/me

#### **Auth**

auth-token required, handle by browser

#### **Behavior**

Soft delete user by mark all senstive information as null and update the time on delete_at in db

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": null
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

### 4.4 GET /user/profile/:username

#### **Auth**

Not Required

#### **parameter**

username

#### **Behavior**

Get other user's public information profile by their given username

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "user": {
      "userId": 30001,
      "username": "undisturbed-str",
      "displayName": "undisturbed-str",
      "createdAt": "2025-11-09T08:24:17.000Z"
    }
  }
}
```

##### 404 Not Found

```json
{
  "status": "fail",
  "data": {
    "username": "Can not found the user of give username"
  }
}
```

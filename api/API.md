API documentation for the User-related endpoints under `/api/users/`:

# User API Documentation

## Base URL  :::  http://omagr.me:3000/

All endpoints are prefixed with `/api/users/`.

## Endpoints

### Register User

**POST** `/register`

Registers a new user.

- **Request Body:**

  ```json
  {
    "first_name": "string",
    "last_name": "string", // Optional
    "email": "string",
    "password": "string",
    "image": "string" // Optional
  }
  ```

- **Responses:**
  - `201 Created` - User registered successfully.
  - `400 Bad Request` - Email already exists or other validation error.

---

### Register User via Facebook or google 

**POST** `/register/facebook`

Registers a user via Facebook. If the user exists, it returns a token; otherwise, it creates a new user.

- **Request Body:**

  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string",
    "user_image": "string" // Optional
  }
  ```

- **Responses:**
  - `200 OK` - User authenticated or registered successfully. Returns a token.
  - `400 Bad Request` - Email is required or other validation error.

---

### User Login

**POST** `/login`

Logs in a user.

- **Request Body:**

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- **Responses:**
  - `200 OK` - Successful login. Returns a token.
  - `400 Bad Request` - Invalid credentials.

---

### Get User Details

**GET** `/user`

Retrieves details of the authenticated user.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Responses:**
  - `200 OK` - User details (excluding password).
  - `401 Unauthorized` - Missing or invalid token.

---

### Update User

**PUT** `/user`

Updates the authenticated user's details.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Request Body:**

  ```json
  {
    "first_name": "string", // Optional
    "last_name": "string",  // Optional
    "email": "string",      // Optional
    "password": "string",   // Required for verification
    "new_password": "string", // Optional, only if changing password
    "user_image": "string"  // Optional
  }
  ```

- **Responses:**
  - `200 OK` - User updated successfully.
  - `400 Bad Request` - Invalid credentials, missing required fields, or validation error.
  - `404 Not Found` - User not found.
  - `500 Internal Server Error` - An error occurred while updating the user.

---

## Authentication

- Most user-related actions require authentication. The token should be provided in the `Authorization` header as `Bearer <token>`.
- Tokens are returned upon successful registration or login and are used to authenticate further requests.

## Error Handling

Common error responses include:

- `400 Bad Request` - Indicates invalid input or request format.
- `401 Unauthorized` - Indicates missing or invalid authentication token.
- `404 Not Found` - Indicates that the requested resource could not be found.
- `500 Internal Server Error` - Indicates an internal error in the server, usually related to database operations or server-side logic.

For more details, please refer to the error message included in the response.

---
Here's the API documentation for the Bid-related endpoints under `/api/bids/`:

---

# Bid API Documentation

## Base URL

All endpoints are prefixed with `/api/bids/`.

## Endpoints

### Place a Bid

**POST** `/:id`

Place a bid on an auction item.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Parameters:**
  - `id` (path): The auction item ID.

- **Request Body:**

  ```json
  {
    "amount": "number" // The bid amount
  }
  ```

- **Responses:**
  - `201 Created` - Bid placed successfully.
  - `400 Bad Request` - Bid must be higher than the current bid or other validation errors.
  - `404 Not Found` - Auction item not found.

- **Additional Information:**
  - Sends an email notification to the previous highest bidder if they are outbid.

---

### View Bid History

**GET** `/:id/bids`

Retrieve the bid history for a specific auction item.

- **Parameters:**
  - `id` (path): The auction item ID.

- **Responses:**
  - `200 OK` - Returns a list of bids, including bidder details.
  - `404 Not Found` - Auction item not found.

- **Sample Response:**

  ```json
  [
    {
      "amount": 150,
      "bidder": {
        "username": "johndoe"
      },
      "timestamp": "2023-07-28T12:34:56.789Z"
    },
    // Additional bids
  ]
  ```

---

### View User's Bids

**GET** `/mybid`

Retrieve the bids placed by the authenticated user.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Responses:**
  - `200 OK` - Returns a list of bids placed by the user, including auction item details.
  - `400 Bad Request` - Error occurred while fetching bids.

- **Sample Response:**

  ```json
  [
    {
      "amount": 200,
      "auctionItem": {
        "title": "Antique Vase",
        "description": "An exquisite antique vase...",
        // Additional auction item details
      },
      "timestamp": "2023-07-28T12:34:56.789Z"
    },
    // Additional bids
  ]
  ```

---

## Authentication

- The `Authorization` header is required for endpoints that modify data or access user-specific information. The token should be provided in the format `Bearer <token>`.
- Tokens are obtained through user registration or login and are used for authentication.

## Error Handling

Common error responses include:

- `400 Bad Request` - Indicates invalid input, such as an insufficient bid amount.
- `401 Unauthorized` - Indicates missing or invalid authentication token.
- `404 Not Found` - Indicates that the requested resource, such as an auction item, could not be found.
- `500 Internal Server Error` - Indicates an internal error in the server, usually related to database operations or server-side logic.

For more details, please refer to the error message included in the response.

---


# Auction API Documentation

## Overview

This document provides detailed information about the Auction API endpoints, including their purposes, request formats, and responses.

## Endpoints

### Create Auction

**POST** `/`

Creates a new auction item.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Request Body:**

  ```json
  {
    "title": "string",
    "description": "string",
    "image": "string",
    "startingBid": "number",
    "endDate": "date"
  }
  ```

- **Responses:**
  - `201 Created` - Auction item created successfully.
  - `400 Bad Request` - Invalid input.

---

### Update Auction

**PUT** `/:id`

Updates an existing auction item.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `id` (string) - The ID of the auction item to update.

- **Request Body:** (Partial or full object for update)

  ```json
  {
    "title": "string",
    "description": "string",
    "image": "string",
    "startingBid": "number",
    "endDate": "date"
  }
  ```

- **Responses:**
  - `200 OK` - Auction item updated successfully.
  - `400 Bad Request` - Invalid input.
  - `403 Forbidden` - Access denied.
  - `404 Not Found` - Auction item not found.

---

### Delete Auction

**DELETE** `/:id`

Deletes an auction item.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `id` (string) - The ID of the auction item to delete.

- **Responses:**
  - `200 OK` - Auction item deleted successfully.
  - `403 Forbidden` - Access denied.
  - `404 Not Found` - Auction item not found.

---

### View All Auctions

**GET** `/`

Retrieves all auction items.

- **Responses:**
  - `200 OK` - List of auction items.
  - `400 Bad Request` - An error occurred.

---

### View My Auctions

**GET** `/my`

Retrieves all auction items created by the authenticated user.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Responses:**
  - `200 OK` - List of auction items.
  - `400 Bad Request` - An error occurred.

---

### View Auction Details

**GET** `/:id`

Retrieves detailed information about a specific auction item.

- **Path Parameters:**
  - `id` (string) - The ID of the auction item.

- **Responses:**
  - `200 OK` - Details of the auction item, including bids, min/max bid, and time remaining.
  - `400 Bad Request` - An error occurred.
  - `404 Not Found` - Auction item not found.

---

### Add Review to Auction

**POST** `/reviews/:id`

Adds a review to an auction item.

- **Headers:**
  - `Authorization: Bearer <token>`

- **Path Parameters:**
  - `id` (string) - The ID of the auction item to review.

- **Request Body:**

  ```json
  {
    "rating": "number",
    "review": "string"
  }
  ```

- **Responses:**
  - `201 Created` - Review added successfully.
  - `400 Bad Request` - An error occurred.
  - `404 Not Found` - Auction item not found.

---

### Authentication

All actions that modify auction data (create, update, delete, add review) require authentication using a token. The token should be provided in the `Authorization` header as `Bearer <token>`.

### Error Handling

Common error responses include:

- `400 Bad Request` - Indicates invalid input or request format.
- `403 Forbidden` - Indicates access is denied, usually due to insufficient permissions.
- `404 Not Found` - Indicates that the requested resource could not be found.



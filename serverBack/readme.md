<<<<<<<<<<<<<<  ✨ Codeium Command 🌟  >>>>>>>>>>>>>>>>
# Product and User Management API

This project implements a RESTful API for managing products and users, allowing data to be stored in memory and files. It features basic CRUD operations with error handling and request logging.

## Features

- **Product Management**
  - Create, read, update, and delete products.
  - Default values for properties.
  - Error handling for all routes.

- **User Management**
  - Create, read, update, and delete users.
  - Default values for properties.
  - Error handling for all routes.

- **Logging**
  - Request logging with Morgan.

## Data Models

### Product
Each product has the following properties:
- `id`: Unique identifier (12 bytes, hexadecimal)
- `title`: Required
- `photo`: Default image path
- `category`: Default category
- `price`: Default value of 1
- `stock`: Default value of 1

### User
Each user has the following properties:
- `id`: Unique identifier (12 bytes, hexadecimal)
- `photo`: Default image path
- `email`: Required
- `password`: Required
- `role`: Default value of 0

## API Endpoints

### Products

- **POST /api/products**
  - Creates a new product.
  - Request body: `{ title: String, photo?: String, category?: String, price?: Number, stock?: Number }`
  - Response:
    - `statusCode: 201`
    - `{ id: String, message: String }`
  
- **GET /api/products**
  - Retrieves all products, optionally filtering by category.
  - Response:
    - `statusCode: 200`
    - `{ response: Array }`
  
- **GET /api/products/:pid**
  - Retrieves a specific product by ID.
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`
  
- **PUT /api/products/:pid**
  - Updates a specific product by ID.
  - Request body: `{ title?: String, photo?: String, category?: String, price?: Number, stock?: Number }`
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`
  
- **DELETE /api/products/:pid**
  - Deletes a specific product by ID.
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`

### Users

- **POST /api/users**
  - Creates a new user.
  - Request body: `{ email: String, password: String, photo?: String, role?: Number }`
  - Response:
    - `statusCode: 201`
    - `{ id: String, message: String }`
  
- **GET /api/users**
  - Retrieves all users, optionally filtering by role.
  - Response:
    - `statusCode: 200`
    - `{ response: Array }`
  
- **GET /api/users/:uid**
  - Retrieves a specific user by ID.
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`
  
- **PUT /api/users/:uid**
  - Updates a specific user by ID.
  - Request body: `{ email?: String, password?: String, photo?: String, role?: Number }`
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`
  
- **DELETE /api/users/:uid**
  - Deletes a specific user by ID.
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`

## How to Run the API
## How to Test the API

1. **Install dependencies:**
   
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
<<<<<<<  495b0a91-3d00-45aa-a1af-0ad4ea5508b0  >>>>>>>






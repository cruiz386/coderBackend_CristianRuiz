# Product and User Management API

This project implements a RESTful API for managing products,users and carts, allowing data to be stored in memory, files and MongoDB. It features basic CRUD operations with error handling and request logging.

## Features

- **Product Management**
  - Create, read, update, and delete products.
  - Default values for properties.
  - Error handling for all routes.
  - Validation for all routes.

- **User Management**
  - Create, read, update, and delete users.
  - Default values for properties.
  - Error handling for all routes.
  - Validation for all routes.

- **Carts Management**
  - Create, read, update, and delete carts.
  - Default values for properties.
  - Error handling for all routes.
  - Validation for all routes.

- **Logging**
  - Request logging with Morgan.

- **Security**
  - Basic authentication.
  
- **Data Models**
  - Product
  - User
  - Carts

- **Database**
  - In-memory
  - File
  - MongoDB




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

### Carts
Each cart has the following properties:
- `_id`: Cart ID (12 bytes, hexadecimal)
- `user_id`: Unique identifier (12 bytes, hexadecimal)
- `product_ids`: Unique identifier (12 bytes, hexadecimal)
- `state`:String, default: "reserved", states values: ["reserved", "paid", "delivered"]


## API Router

### Carts
- cartsApiRouter.post("/", create);
- cartsApiRouter.get("/", readAll);
- cartsApiRouter.put("/:cid", update);
- cartsApiRouter.delete("/:cid", destroy);
- cartsApiRouter.get("/:cid", read);
- cartsApiRouter.get("/total/:uid", calculateTotal);

### Users
- usersRouter.get('/', userController.readUsers)
- usersRouter.get('/:uid', userController.readUserById)
- usersRouter.post("/",isValidDataUser, userController.createUser);
- usersRouter.put('/:uid',isValidDataUser, userController.updateUser);
- usersRouter.delete('/:uid', userController.deleteUser)

### Products
- productsRouter.get('/', getAllProducts)
- productsRouter.get('/paginate', paginate)
- productsRouter.get('/:pid', getProductById)
- productsRouter.post("/", isValidDataProduct, create);
- productsRouter.put('/:pid', isValidDataProduct, updateProduct);
- productsRouter.delete('/:pid', destroyProduct)


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

### Carts

- **POST /api/carts**
  - Creates a new cart.
  - Request body: `{ user: String, products?: Array, total?: Number }`
  - Response:
    - `statusCode: 201`
    - `{ id: String, message: String }`
  
- **GET /api/carts**
  - Retrieves all carts, optionally filtering by user.
  - Response:
    - `statusCode: 200`
    - `{ response: Array }`
  
- **GET /api/carts/:cid**
  - Retrieves a specific cart by ID.
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`
  
- **PUT /api/carts/:cid**
  - Updates a specific cart by ID.
  - Request body: `{ user?: String, products?: Array, total?: Number }`
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`
  
- **DELETE /api/carts/:cid**
  - Deletes a specific cart by ID.
  - Response:
    - `statusCode: 200`
    - `{ response: Object }`

## How to Run the API

1. **Install dependencies:**
    
      ```bash
    npm install
     ```


2. **Open the server in the browser:**

    ```bash
    npm run dev
    ```

## Additional Resources 

- [Morgan](https://github.com/expressjs/morgan) for request logging.


#### Clone repo: 
git clone https://github.com/cruiz386/coderBackend_CristianRuiz.git










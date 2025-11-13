# NexRead API

This repository contains the backend API for NexRead, an e-library ("elib") project. It is a TypeScript and Express.js application that handles user authentication, book management, and file uploads.

## Features

- **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Book Management**: Full CRUD (Create, Read, Update, Delete) functionality for books.
- **File Uploads**: Handles uploading of book cover images and PDF files using Multer for temporary storage and Cloudinary for permanent cloud storage.
- **Configuration Management**: Uses `dotenv` to manage environment variables for different environments.
- **Error Handling**: A global error handler is implemented to provide consistent error responses.
- **Database**: Uses Mongoose to model and interact with a MongoDB database.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: `bcrypt`, `jsonwebtoken`
- **File Storage**: Cloudinary
- **File Uploads**: `multer`
- **Package Manager**: `pnpm`
- **Dev Tools**: `nodemon`, `tsx`, `eslint`, `tsc-alias`

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- `pnpm` package manager (version 10.20.0 specified)
- A MongoDB database (local or cloud-hosted)
- A Cloudinary account for API credentials

### Installation

1.  Clone the repository:

    ```sh
    git clone https://github.com/luckygoswami/nexread-api
    cd nexread
    ```

2.  Install dependencies using `pnpm`:

    ```sh
    pnpm install
    ```

### Configuration

1.  Create a `.env` file in the root directory by copying the example:

    ```sh
    cp .env.example .env
    ```

2.  Update the `.env` file with your credentials:

    ```ini
    PORT=5513 # Or any port you prefer
    MONGODB_CONNECTION_STRING='your-mongodb-connection-string'
    NODE_ENV='development'
    JWT_SECRET='your-strong-jwt-secret'
    CLOUD_NAME='your-cloudinary-cloud_name'
    CLOUD_API_KEY='your-cloudinary-api_key'
    CLOUD_API_SECRET='your-cloudinary-api_secret'
    ```

### Running the Application

- **Development Mode**:
  This command uses `nodemon` and `tsx` to run the server with hot-reloading.

  ```sh
  pnpm dev
  ```

  The server will start on the port specified in your `.env` file (e.g., `http://localhost:5513`).

- **Production Mode**:

  1.  Build the TypeScript project:

      ```sh
      pnpm build
      ```

      This compiles the TypeScript code to JavaScript in the `dist/` directory and resolves path aliases.

  2.  Start the compiled server:

      ```sh
      pnpm start
      ```

      This runs the compiled `dist/server.js` file using Node.

## API Endpoints

All endpoints are prefixed with `/api`.

### User Routes (`/api/users`)

- `POST /register`: Creates a new user and returns a JWT.
  - **Body**: `{ "name": "...", "email": "...", "password": "..." }`
- `POST /login`: Authenticates a user and returns a JWT.
  - **Body**: `{ "email": "...", "password": "..." }`

### Book Routes (`/api/books`)

- `POST /`: Creates a new book.
  - **Auth**: Required (Bearer Token).
  - **Body**: `multipart/form-data` with fields for `title`, `description`, `genre`, `coverImage` (file), and `file` (PDF file).
- `GET /`: Lists all books.
  - **Auth**: Not required.
- `GET /:bookId`: Gets a single book by its ID.
  - **Auth**: Not required.
- `PATCH /:bookId`: Updates a book's details.
  - **Auth**: Required (Bearer Token). Only the author of the book can update it.
  - **Body**: `multipart/form-data` with optional fields for `title`, `description`, `genre`, `coverImage`, and `file`.
- `DELETE /:bookId`: Deletes a book.
  - **Auth**: Required (Bearer Token). Only the author of the book can delete it.

## Project Structure

```
.
├── server.ts             # Main application entry point
├── src
│   ├── app.ts            # Express app configuration (middleware, routes)
│   ├── config
│   │   ├── config.ts       # Environment variable loading (dotenv)
│   │   ├── db.ts           # MongoDB connection logic
│   │   └── cloudinary.ts   # Cloudinary SDK configuration
│   ├── features
│   │   ├── book          # Book-related module
│   │   │   ├── bookController.ts # Business logic for book CRUD
│   │   │   ├── bookModel.ts      # Mongoose schema for Books
│   │   │   ├── bookRoute.ts      # Routes for /api/books
│   │   │   └── bookTypes.ts      # TypeScript interfaces for Books
│   │   └── user          # User-related module
│   │       ├── userController.ts # Business logic for auth
│   │       ├── userModel.ts      # Mongoose schema for Users
│   │       ├── userRoute.ts      # Routes for /api/users
│   │       └── userTypes.ts      # TypeScript interfaces for Users
│   └── middlewares
│       ├── authenticate.ts       # JWT authentication middleware
│       ├── globalErrorHandler.ts # Global error handling
│       └── multer.ts             # Multer configuration for file uploads
├── .env.example          # Example environment variables
├── package.json          # Project dependencies and scripts
├── pnpm-lock.yaml        # PNPM lock file
└── tsconfig.json         # TypeScript compiler options
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests to enhance the functionality of Credinox.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

If you have any questions or suggestions, feel free to open an issue on GitHub or contact me directly via [GitHub Issues](https://github.com/luckygoswami/nexread-api/issues).

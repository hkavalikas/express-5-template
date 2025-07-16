# Express 5 REST API Template

A modern REST API template built with Express 5, TypeScript, Zod validation, and Drizzle ORM using a layered architecture pattern.

## Features

- **Express 5 Beta** - Latest version with improved performance
- **TypeScript** - Full type safety throughout the application
- **Zod** - Runtime type validation and schema definition
- **Drizzle ORM** - Type-safe database operations with SQLite
- **Layered Architecture** - Clean separation of concerns (Controller → Service → Repository)
- **Automatic Error Handling** - Centralized error handling for async routes
- **ESLint & Prettier** - Code formatting and linting
- **Husky & lint-staged** - Pre-commit hooks for code quality
- **Hot Reload** - Development server with auto-restart

## Project Structure

```
src/
├── api/
│   ├── index.ts              # Application entry point
│   ├── posts/                # Posts module
│   │   ├── PostController.ts # HTTP request handling
│   │   ├── PostService.ts    # Business logic
│   │   ├── PostRepository.ts # Data access layer
│   │   ├── routes.ts         # Route definitions
│   │   └── schemas/
│   │       └── schemas.ts    # Zod validation schemas
│   └── comments/             # Comments module
│       ├── CommentController.ts
│       ├── CommentService.ts
│       ├── CommentRepository.ts
│       ├── routes.ts
│       └── schemas/
│           └── schemas.ts
└── common/
    ├── db/
    │   ├── index.ts          # Database connection
    │   ├── schema.ts         # Database schema
    │   └── migrations/       # Database migrations
    ├── middleware/
    │   └── errorHandler.ts   # Error handling middleware
    └── schemas/
        └── schema.ts         # Shared validation schemas
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run db:push
   ```

### Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Available Scripts

- `npm run build` - Build the application for production
- `npm run dev` - Start development server with hot reload
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push database schema changes
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments` - Get all comments
- `GET /api/comments/:id` - Get comment by ID
- `GET /api/comments/post/:postId` - Get comments by post ID
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## Architecture

This template follows a layered architecture pattern:

1. **Controller Layer** - Handles HTTP requests/responses and validation
2. **Service Layer** - Contains business logic and orchestrates operations
3. **Repository Layer** - Manages data access and database operations

### Error Handling

The template includes automatic error handling for async routes:
- **wrapAsyncRoutes()** - Automatically wraps async route handlers to catch errors
- **errorHandler()** - Centralized error handling middleware with proper status codes
- **AppError** - Custom error class for application-specific errors
- **Zod validation** - Automatic validation error handling with detailed messages

## Database

Uses SQLite with Drizzle ORM for type-safe database operations. The schema includes:
- **Posts** table with id, title, content, and timestamps
- **Comments** table with id, content, postId (foreign key), and timestamps

## Code Quality

- **ESLint** - Configured with TypeScript rules and Prettier integration
- **Prettier** - Code formatting with consistent style
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Runs linting and formatting on staged files

## Technologies Used

- [Express 5](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zod](https://zod.dev/) - Schema validation
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [ESBuild](https://esbuild.github.io/) - Fast bundler
- [Nodemon](https://nodemon.io/) - Development server
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License
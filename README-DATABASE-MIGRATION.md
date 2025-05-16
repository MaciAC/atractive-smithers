# Database Migration Guide

This project has been migrated from using a JSON file as a data source to using PostgreSQL. This document provides information on how to set up and use the new database.

## Database Schema

The PostgreSQL database uses the following schema:

```sql
-- Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_pic_url TEXT
);

-- Posts Table
CREATE TABLE posts (
    id VARCHAR(255) PRIMARY KEY,
    date TIMESTAMP,
    likes INTEGER NOT NULL DEFAULT 0,
    caption TEXT,
    total_comments INTEGER NOT NULL DEFAULT 0
);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT is_thread_comment CHECK (parent_comment_id IS NULL OR parent_comment_id != id)
);

-- Indexes for better performance
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
```

## Environment Setup

Create an `.env.local` file in the root of your project with the following content:

```
# Database connection
POSTGRES_URL="postgresql://username:password@hostname:5432/database_name"

# Set this to "production" in production environments
NODE_ENV="development"
```

Replace the values in the `POSTGRES_URL` with your actual PostgreSQL connection details.

### SSL Certificates

The application is configured to accept self-signed SSL certificates from the PostgreSQL database in both development and production environments. This is done by setting the `rejectUnauthorized` option to `false` in the SSL configuration.

If you have a valid SSL certificate and want to enforce certificate validation in production, you can modify the `getPool` function in `src/lib/db.ts`:

```typescript
const getPool = (): Pool => {
  if (!globalPool.pool) {
    globalPool.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: true } // Change to true to enforce certificate validation
        : { rejectUnauthorized: false }, // Accept self-signed certificates in development
    });
  }
  return globalPool.pool;
};
```

## Database Connection

The database connection is managed through a singleton pool in the `src/lib/db.ts` file. This ensures efficient connection management across the application.

## API Routes

The following API routes have been implemented:

- `GET /api/posts` - Get all posts
- `GET /api/posts/:postId` - Get a specific post with its comments
- `GET /api/comments` - Get comments with optional search and sort parameters
- `GET /api/search` - Search posts with filtering and sorting
- `GET /api/stats` - Get aggregated statistics for visualization

## Implementation Details

The migration involved:

1. Creating a database utility module in `src/lib/db.ts`
2. Implementing API routes to fetch data from PostgreSQL
3. Modifying all pages to use the API routes instead of importing the JSON file

### Pages Updated

- Home page (`src/app/page.tsx`)
- Forums page (`src/app/foros/page.tsx`)
- Search page (`src/app/buscali/page.tsx`)
- Stats page (`src/app/numbrus/page.tsx`)

## Data Migration

To migrate your existing JSON data to PostgreSQL, you will need to:

1. Create the database tables using the schema provided above
2. Parse the JSON file and insert the data into the corresponding tables
3. Ensure all relationships are preserved (user -> comments, posts -> comments, parent comments -> thread comments)

## Troubleshooting

If you encounter issues:

1. Verify your PostgreSQL connection string in the `.env.local` file
2. Check PostgreSQL logs for any database errors
3. Check the server logs for API request/response issues

### Common Errors

#### SSL Certificate Errors

If you see errors related to "self-signed certificate in certificate chain", it means your PostgreSQL server is using a self-signed certificate. This is already handled in the code by setting `rejectUnauthorized: false`, but if you're still seeing errors, verify that your connection URL is correct.

#### Connection Timeouts

If you're experiencing connection timeouts:
- Verify that your PostgreSQL server is running and accessible from your application server
- Check firewall settings to ensure the PostgreSQL port (typically 5432) is open
- Make sure the database user has the necessary permissions to access the database
```md
# Threadit

A lightweight Reddit-like community discussion platform built with the MERN stack.

## Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion, Shadcn/ui, Lucide React, Sonner

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT

## Features

- JWT based authentication (register, login)
- Create, edit, delete posts
- Upvote / downvote posts and comments
- Fully nested comments (Reddit-style)
- User profiles
- Search posts
- Sort by Hot / New / Top

## Project Structure
```

Threadit/
├── api/ # Express REST API
└── web/ # React frontend

````

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

### Backend

```bash
cd api
npm install
cp .env.example .env  # fill in your values
npm run dev
````

### Frontend

```bash
cd web
npm install
cp .env.example .env.local  # fill in your values
npm run dev
```

## Environment Variables

**api/.env**

```
PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

**web/.env**

```
VITE_API_URL=http://localhost:3000/api
```

## API Routes

| Method | Route                  | Auth | Description      |
| ------ | ---------------------- | ---- | ---------------- |
| POST   | /api/auth/register     | No   | Register         |
| POST   | /api/auth/login        | No   | Login            |
| GET    | /api/auth/me           | Yes  | Get current user |
| GET    | /api/posts             | No   | Get all posts    |
| GET    | /api/posts/:id         | No   | Get single post  |
| POST   | /api/posts             | Yes  | Create post      |
| PUT    | /api/posts/:id         | Yes  | Update post      |
| DELETE | /api/posts/:id         | Yes  | Delete post      |
| POST   | /api/posts/:id/vote    | Yes  | Vote post        |
| GET    | /api/comments/:postId  | No   | Get comments     |
| POST   | /api/comments          | Yes  | Create comment   |
| PUT    | /api/comments/:id      | Yes  | Update comment   |
| DELETE | /api/comments/:id      | Yes  | Delete comment   |
| POST   | /api/comments/:id/vote | Yes  | Vote comment     |
| GET    | /api/users/:username   | No   | Get profile      |
| PUT    | /api/users/:id         | Yes  | Update profile   |

```

Put this in the root of your project. Ready for frontend?
```

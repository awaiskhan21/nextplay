# NextPlay

NextPlay is a collaborative music queuing platform that allows users to add YouTube videos to a shared queue. Users can vote on songs, and the track with the most votes plays next when the current song ends.

## Features

- User authentication with Google login (powered by NextAuth)
- YouTube video integration for music playback
- Collaborative song queuing system
- Real-time voting system for song selection
- Automatic removal of played songs from the queue
- Shareable creator pages

## Project Walkthrough

[Watch the walkthrough on YouTube](https://youtu.be/9UKQw-FavPE)

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building the frontend and API routes
- [NextAuth](https://next-auth.js.org/) - Authentication solution for Next.js applications
- [Prisma](https://www.prisma.io/) - ORM for database management
- [PostgreSQL](https://www.postgresql.org/) - Relational database for data storage
- [YouTube API](https://developers.google.com/youtube/v3) - For fetching and playing YouTube videos
- [Docker](https://www.docker.com/) - For containerizing the PostgreSQL database

## Getting Started

### Prerequisites

- Node.js
- Docker
- Google API credentials for authentication and YouTube integration

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/awaiskhan21/nextplay
   ```

2. Set up PostgreSQL using Docker:

   ```
   docker run -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
   ```

3. Install dependencies:

   ```
   pnpm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

5. Run database migrations and generate Prisma client:

   ```
   npx prisma migrate dev
   npx prisma generate
   ```

6. Start the development server:
   ```
   npm run dev
   ```

Visit `http://localhost:3000` to see the application running.

## Usage

1. Log in using your Google account.
2. Paste a YouTube URL to add a song to the queue.
3. Share your creator page with friends to collaborate.
4. Votes on songs in the queue.
5. The song with the most votes plays next when the current song ends.
6. Played songs are automatically removed from the queue.

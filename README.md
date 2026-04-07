# Infinity Note

A modern note-taking web application built with Next.js and MongoDB.

Live link: https://infinity-note.vercel.app

## Features

- 📝 Create, edit, and delete notes
- 🏷️ Organize notes by categories
- 📱 Responsive design (mobile-first, optimized for large screens)
- 🔍 Filter notes by category
- 💾 Persistent storage with MongoDB

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your MongoDB connection string:

   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/          # API routes for CRUD operations
│   ├── new/          # New note creation page
│   ├── note/[id]/    # Note editing page
│   ├── profile/      # Profile page
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
├── lib/             # Utility functions (MongoDB connection)
├── models/          # MongoDB models
└── package.json     # Dependencies
```

## Usage

- **Create a note**: Click the "+" button (FAB) on the home page or click "New" in the sidebar
- **Edit a note**: Click on any note card to edit it
- **Delete a note**: Hover over a note card and click the delete icon
- **Filter by category**: Use the sidebar to filter notes by category
- **Add category**: Click "New Category" in the sidebar (currently local only)

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- MongoDB with Mongoose
- CSS Modules

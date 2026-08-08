# Infinity Note

A modern, fast, and free note-taking web application built with Next.js and MongoDB. Take unlimited notes, organize them with categories, and sync across all your devices.

**Live App**: https://infinity-note.vercel.app

## Why Choose Infinity Note?

✨ **Free Forever** - No premium tiers, no paywalls  
📝 **Unlimited Notes** - Create as many notes as you need  
🏷️ **Smart Categories** - Organize notes your way  
☁️ **Cloud Sync** - Access notes from anywhere  
📱 **Mobile Friendly** - Works perfectly on all devices  
🔒 **Secure** - Your data is safe with Firebase auth  
⚡ **Lightning Fast** - PWA technology for instant loading  
🌙 **Beautiful Design** - Clean, modern dark interface

## Features

- 📝 Create, edit, and delete notes instantly
- 🏷️ Organize notes with custom categories
- 📱 Fully responsive design (mobile-first, optimized for large screens)
- 🔍 Powerful search to find notes quickly
- 💾 Persistent storage with MongoDB
- ☁️ Cloud synchronization with Firebase
- 🔄 Works offline - access notes without internet
- 🎨 Clean, intuitive interface
- ⚡ Progressive Web App (PWA) - install on your device
- 🔐 Secure authentication with Google Sign-In

## Perfect For

- 🎓 **Students** - Take class notes, organize study materials
- 💼 **Professionals** - Meeting notes, project documentation
- ✍️ **Writers** - Story ideas, drafts, research notes
- 📋 **Project Managers** - Task tracking, team notes
- 🧑‍💻 **Developers** - Code snippets, documentation
- 📝 **Anyone** - Daily journaling, to-do lists, reminders

## Why Better Than Alternatives?

| Feature             | Infinity Note | Evernote        | Notion         | Google Keep |
| ------------------- | ------------- | --------------- | -------------- | ----------- |
| **Free**            | ✅ Forever    | Limited         | Limited        | ✅          |
| **Unlimited Notes** | ✅            | ❌ (60MB/month) | ✅             | ✅          |
| **Categories**      | ✅            | ✅ (Tags)       | ✅ (Databases) | ✅ (Labels) |
| **Offline Access**  | ✅            | Premium only    | ✅             | ✅          |
| **Simple UI**       | ✅            | ❌ Complex      | ❌ Complex     | ✅          |
| **No Ads**          | ✅            | ❌              | ✅             | ✅          |
| **Fast**            | ✅ PWA        | ❌              | ❌             | ✅          |

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
- **Add category**: Click "New Category" in the sidebar

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- MongoDB with Mongoose
- Firebase Authentication
- Progressive Web App (PWA)
- CSS Modules

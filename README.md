# Study Timetable App

A minimalist, interactive study planner built with React, TypeScript, and Vite. The app features a "Cute Soft Dark Mode" aesthetic and is designed to help users track their study subjects, topics, and schedule revision sessions.

## New Features

- **Public & Admin Views**: The app is now split into a public read-only view and a protected admin dashboard.
- **Firebase Authentication**: Secure access to the admin panel using Firebase Auth.
- **Protected Routing**: Role-based access control to ensure only authorized users can modify the timetable.

## Core Features

- **Subject & Topic Management**: Create and organize subjects and their respective topics (Admin only).
- **Interactive Scheduling**: Schedule specific study sessions for topics using a calendar-based interface (Admin only).
- **Spaced Repetition Ready**: Track multiple revision dates for single topics.
- **Firebase Real-Time Sync**: All data is saved and synchronized instantly across multiple devices using Firebase Firestore.
- **Read-Only Public Mode**: Share your progress with others via the public link without worrying about accidental changes.
- **Beautiful UI**: "Cute Soft Dark Mode" with smooth micro-animations and fully responsive design.

## Tech Stack

- React
- TypeScript
- Vite
- Firebase (Firestore & Auth)
- React Router
- Custom CSS (Soft Dark Theme)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

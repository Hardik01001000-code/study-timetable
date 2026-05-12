# Study Timetable App

A minimalist, interactive study planner built with React, TypeScript, and Vite. The app features a "Cute Soft Dark Mode" aesthetic and is designed to help users track their study subjects, topics, and schedule revision sessions.

## Features

- **Subject & Topic Management**: Create and organize subjects and their respective topics.
- **Interactive Scheduling**: Schedule specific study sessions for topics using a calendar-based interface.
- **Spaced Repetition Ready**: Track multiple revision dates for single topics.
- **Firebase Real-Time Sync**: All data is saved and synchronized instantly across multiple devices using Firebase Firestore.
- **Automatic Default Initialization**: For new databases, a default comprehensive syllabus (including General Aptitude, Engineering Mathematics, and core civil engineering subjects) is automatically loaded to get started immediately.
- **Data Migration**: A temporary "Migrate Data to Firebase" button is available at the bottom of the app to easily seed your new Firestore database with predefined syllabus data.
- **Beautiful UI**: "Cute Soft Dark Mode" with smooth micro-animations and fully responsive design.

## Tech Stack

- React
- TypeScript
- Vite
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

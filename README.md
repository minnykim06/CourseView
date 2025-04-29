# CourseView

A web application for browsing and exploring courses available at Pleasanton Unified School District with commenting functionality.

## Overview

CourseView is a React-based web application that allows users to browse through course offerings, filter by subject and level, search by name, view detailed information about each course, and leave comments.

## Features

- Browse all available courses with a clean, card-based interface
- Filter courses by subject and level
- Search courses by name
- View detailed information about each course
- Leave and read comments on courses
- Responsive design for all device sizes

## Project Structure

The project is divided into two main parts:

- `client/`: React frontend application
- `server/`: Node.js/Express backend API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation and Setup

1. Clone the repository:

   ```
   git clone https://github.com/minnykim06/CourseView.git
   cd CourseView
   ```

2. Install dependencies for both client and server:

   ```
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

### Running the Application

You'll need to run both the server and client in separate terminal windows.

1. **Start the server**:

   ```
   cd server
   npm start
   ```

   The server will run on http://localhost:5001

2. **Start the client**:

   ```
   cd client
   npm start
   ```

   The client will run on http://localhost:3000

3. Open your browser and navigate to http://localhost:3000 to view the application.

## Usage

- **Browse Courses**: The home page displays all available courses.
- **Filter Courses**: Use the dropdown menus to filter by subject and level.
- **Search**: Type in the search box to find courses by name.
- **View Details**: Click "Learn more" on any course card to see detailed information.
- **Leave Comments**: On the course detail page, enter your name and comment to share your experience.

## API Endpoints

- `GET /api/courses`: Returns a list of all courses
- `GET /api/courses/:id`: Returns details for a specific course
- `GET /api/courses/:id/comments`: Returns comments for a specific course
- `POST /api/courses/:id/comments`: Creates a new comment for a specific course

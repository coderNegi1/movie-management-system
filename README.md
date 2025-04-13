# movie-management-system
 Overview
This controller manages routes for a movie-based web application using Express.js. It includes features such as user authentication, movie management, password reset via email, contact form handling, search functionality, and session-based dashboard access.

 Key Features
 Public Routes
Home (/): Displays all movies.

About (/about) and Contact (/contact): Static pages.

Movie Details (/details/:id): View a single movie’s info.

Pricing (/pricing): Static pricing info.

👤 Authentication & User Management
Register (/register): New user registration.

Login (/login): User login with session setup.

Forget Password: Sends a reset link via email.

Reset Password (/resetPassword/:token): Allows secure password update.

View/Edit/Delete Users: Dashboard CRUD operations on user data.

🎬 Movie Management
Add Movie (/addmovie): Form to upload new movie (with image via multer).

View Movies (/viewmovies): Shows all added movies.

Edit/Delete Movie: Dashboard operations for managing movies.

// Contact Form
Submit Contact (/contact): Post contact info.

View/Edit/Delete Contacts: Admin management in the dashboard.

 Search API
/search?query=xyz: Search movies by name.

 Comment API (Stub)
Post Comment: Adds a comment to a movie.

(Comment GET API is commented out.)

 Session Management
Uses express-session & cookie-parser to handle user sessions securely.

 Technologies Used
Express.js

Mongoose/MongoDB

Multer (file uploads)

bcrypt (password hashing)

Nodemailer (email services)

UUID & Crypto (token generation)

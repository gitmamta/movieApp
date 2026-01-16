IMDb Top Movies App

A full-stack movie application to view, search, add, edit, and delete movies. Built with React (frontend) and Node.js + Express + MongoDB (backend), deployed on Netlify and Render.

Features
Frontend

Home Page: Displays the latest movies with posters, titles, year, and IMDb ratings.

Search Functionality: Search movies by title from both desktop and mobile views.

Admin Panel:

Add new movies

Edit existing movies

Delete movies

Responsive Navbar: Works on desktop and mobile.

Movie Details: View movie info including crew and IMDb ratings.

Backend

API Endpoints:

GET /movies – Fetch all movies

GET /movies/sorted?by=<field> – Fetch sorted movies (name, rating, releaseDate, rank)

GET /movies/search?query=<term> – Search movies by title or crew

POST /movies – Add a new movie

PUT /movies/:id – Update a movie

DELETE /movies/:id – Delete a movie

MongoDB Integration: Stores movie data.

CORS Enabled: Allows frontend (Netlify) to communicate with backend (Render).

Tech Stack

Frontend: React, Material UI (MUI), React Router DOM

Backend: Node.js, Express.js, MongoDB, Mongoose

Deployment: Netlify (frontend), Render (backend)

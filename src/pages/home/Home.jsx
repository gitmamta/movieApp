import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, CardActions, Button, CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Rating } from "@mui/material";


export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    fetch("https://movie-backend-8f8u.onrender.com") // Replace with your backend URL
      .then((res) => res.json())
      .then((data) => {
        // Filter if search query exists
        if (searchQuery) {
          const filtered = data.filter((movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setMovies(filtered);
        } else {
          setMovies(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, [searchQuery]); // Re-run when search changes

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Latest Movies
      </Typography>

      {movies.length === 0 && <Typography>No movies found.</Typography>}

      <Grid container spacing={3}>
  {movies.map((movie) => (
    <Grid item xs={12} sm={6} md={3} key={movie._id}>
      
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={movie.image}
          alt={movie.title}
        />

        <CardContent>
  <Typography variant="h6" noWrap sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
    {movie.title}
  </Typography>

  <Typography variant="body2" color="text.secondary">
    Year: {movie.year}
  </Typography>

  <Rating
    value={Number(movie.imDbRating) / 2} // IMDb is out of 10, stars are out of 5
    precision={0.5}
    readOnly
    size="small"
  />

  <Typography variant="caption" color="text.secondary">
    {movie.imDbRating} / 10
  </Typography>
</CardContent>


        <CardActions>
          <Button size="small" color="primary">
            Details
          </Button>
          <Button size="small" color="secondary">
            Watch
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>

    </div>
  );
}

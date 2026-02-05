import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardActions,
  Button,
  CircularProgress,
  Rating,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Use axios directly

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  // Hardcoded backend URL
  const API_BASE = "https://movie-backend-8f8u.onrender.com"; 

  useEffect(() => {
    setLoading(true);
    setError("");

    const url = searchQuery
      ? `${API_BASE}/movies/search?query=${encodeURIComponent(searchQuery)}`
      : `${API_BASE}/movies`;

    axios
      .get(url)
      .then((res) => {
        setMovies(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again later.");
        setMovies([]);
        setLoading(false);
      });
  }, [searchQuery]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color="error"
        style={{ textAlign: "center", marginTop: 50 }}
      >
        {error}
      </Typography>
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
                image={movie.image || "/placeholder.jpg"}
                alt={movie.title}
              />

              <CardContent>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {movie.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Year: {movie.year || "N/A"}
                </Typography>

                <Rating
                  value={Number(movie.imDbRating || 0) / 2}
                  precision={0.5}
                  readOnly
                  size="small"
                />

                <Typography variant="caption" color="text.secondary">
                  {movie.imDbRating || "N/A"} / 10
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

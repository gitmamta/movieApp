import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

export default function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q"); // the search query

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = "https://movie-backend-8f8u.onrender.com";

  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/movies/search`, {
        params: { query: q },
      });
      setMovies(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch movies. Please try again later.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (q) fetchMovies();
    else setMovies([]);
  }, [q]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 5 }}>
        {error}
      </Typography>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Search Results for: "{q}"
      </Typography>

      {movies.length === 0 ? (
        <Typography>No movies found.</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rank: {movie.rank} | Year: {movie.year} | Rating: {movie.imDbRating}
                  </Typography>
                  {movie.crew && (
                    <Typography variant="body2" color="text.secondary">
                      Crew: {movie.crew}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    href={`/movie?id=${movie._id}`}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

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

export default function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q"); // the search query

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/movies/search?query=${q}`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
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
                    Rank: {movie.rank} | Year: {movie.year} | Rating:{" "}
                    {movie.imDbRating}
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
                    href={`/movie?id=${movie._id}`} // navigate to movie page
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

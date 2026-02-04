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
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Hardcoded backend URL (Render)
  const API_BASE = "https://movie-backend-8f8u.onrender.com"; // no trailing slash

  const fetchMovies = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const url = query
        ? `${API_BASE}/movies/search?query=${encodeURIComponent(query)}`
        : `${API_BASE}/movies`;
      console.log("Fetching from:", url); // Debug
      const res = await axios.get(url);
      setMovies(res.data || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies. Please try again later.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    fetchMovies(searchQuery);
  };

  // Optional: handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Latest Movies
      </Typography>

      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography
          variant="h6"
          color="error"
          style={{ textAlign: "center", marginTop: 50 }}
        >
          {error}
        </Typography>
      ) : movies.length === 0 ? (
        <Typography>No movies found.</Typography>
      ) : (
        <Grid container spacing={3} style={{ marginTop: 10 }}>
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
      )}
    </div>
  );
}

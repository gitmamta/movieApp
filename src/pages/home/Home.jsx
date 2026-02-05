import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
  Rating,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

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
        setMovies(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch movies. Please try again later.");
        setMovies([]);
        setLoading(false);
      });
  }, [searchQuery]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6, backgroundColor: "#000", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color="error"
        align="center"
        sx={{ mt: 6, backgroundColor: "#000", minHeight: "100vh", color: "white" }}
      >
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#000", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="white">
        Latest Movies
      </Typography>

      {movies.length === 0 && (
        <Typography align="center" sx={{ mt: 4, color: "white" }}>
          No movies found.
        </Typography>
      )}

      {/* Flex container for cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {movies.map((movie) => (
          <Box
            key={movie._id}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 48%", md: "1 1 23%" },
              maxWidth: { xs: "100%", sm: "48%", md: "23%" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)" },
                backgroundColor: "#1c1c1c", // dark card
              }}
            >
              {/* Image with border */}
              <Box
                sx={{
                  width: "100%",
                  position: "relative",
                  pt: "150%", // 2:3 ratio
                  overflow: "hidden",
                  border: "2px solid #444",
                  borderRadius: 1,
                  backgroundColor: "#000",
                  m: 1,
                }}
              >
                <img
                  src={movie.image || "/placeholder.jpg"}
                  alt={movie.title}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* Card Content */}
              <CardContent sx={{ flexGrow: 1, textAlign: "center", py: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 48,
                    color: "white",
                  }}
                >
                  {movie.title}
                </Typography>

                <Typography variant="body2" sx={{ color: "#ccc" }}>
                  Year: {movie.year || "N/A"}
                </Typography>

                <Rating
                  value={Number(movie.imDbRating || 0) / 2}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ mt: 0.5 }}
                  style={{ color: "#ffb400" }}
                />

                <Typography variant="caption" sx={{ color: "#ccc" }}>
                  {movie.imDbRating || "N/A"} / 10
                </Typography>
              </CardContent>

              {/* Card Actions */}
              <CardActions sx={{ mt: "auto", justifyContent: "center" }}>
                <Button size="small" sx={{ color: "white" }}>Details</Button>
                <Button size="small" sx={{ color: "#ffb400" }}>Watch</Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

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

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    fetch("https://movie-backend-8f8u.onrender.com/movies")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const filtered = searchQuery
          ? data.filter((movie) =>
              movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : data;

        setMovies(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [searchQuery]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Latest Movies
      </Typography>

      {movies.length === 0 && (
        <Typography align="center" sx={{ mt: 4 }}>
          No movies found.
        </Typography>
      )}

      {/* ✅ CSS GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {movies.map((movie) => (
          <Card
            key={movie._id}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            {/* Image container */}
            <Box
              sx={{
                height: 300,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={movie.image || "/placeholder.jpg"}
                alt={movie.title}
                onError={(e) => (e.target.src = "/placeholder.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // keeps poster ratio
                  display: "block",
                }}
              />
            </Box>

            {/* Card content */}
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: 56,
                }}
              >
                {movie.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Year: {movie.year}
              </Typography>

              <Rating
                value={Number(movie.imDbRating) ? Number(movie.imDbRating) / 2 : 0}
                precision={0.5}
                readOnly
                size="small"
                sx={{ mt: 1 }}
              />

              <Typography variant="caption" color="text.secondary">
                {movie.imDbRating || "N/A"} / 10
              </Typography>
            </CardContent>

            {/* Buttons centered */}
            <CardActions sx={{ mt: "auto", justifyContent: "center" }}>
              <Button size="small">Details</Button>
              <Button size="small" color="secondary">
                Watch
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

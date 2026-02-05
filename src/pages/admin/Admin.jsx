import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Box,
} from "@mui/material";
import api from "../../api/api"; // adjust path

export default function Admin() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({
    rank: "",
    title: "",
    fullTitle: "",
    year: "",
    image: "",
    crew: "",
    imDbRating: "",
    imDbRatingCount: "",
  });

  // Fetch movies from backend
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/movies"); // uses api.js
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Open dialog for add or edit
  const handleOpenDialog = (movie = null) => {
    if (movie) {
      setIsEdit(true);
      setCurrentMovie({
        _id: movie._id,
        rank: movie.rank || "",
        title: movie.title || "",
        fullTitle: movie.fullTitle || "",
        year: movie.year || "",
        image: movie.image || "",
        crew: movie.crew || "",
        imDbRating: movie.imDbRating || "",
        imDbRatingCount: movie.imDbRatingCount || "",
      });
    } else {
      setIsEdit(false);
      setCurrentMovie({
        rank: "",
        title: "",
        fullTitle: "",
        year: "",
        image: "",
        crew: "",
        imDbRating: "",
        imDbRatingCount: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  // Handle input changes
  const handleChange = (e) => {
    setCurrentMovie({ ...currentMovie, [e.target.name]: e.target.value });
  };

  // Add or edit movie
  const handleSave = async () => {
    if (!currentMovie.rank || !currentMovie.title) {
      alert("Rank and Title are required");
      return;
    }

    const payload = {
      rank: Number(currentMovie.rank),
      title: currentMovie.title,
      fullTitle: currentMovie.fullTitle,
      year: currentMovie.year ? Number(currentMovie.year) : null,
      image: currentMovie.image,
      crew: currentMovie.crew,
      imDbRating: currentMovie.imDbRating
        ? Number(currentMovie.imDbRating)
        : null,
      imDbRatingCount: currentMovie.imDbRatingCount
        ? Number(currentMovie.imDbRatingCount)
        : null,
    };

    try {
      if (isEdit) {
        await api.put(`/movies/${currentMovie._id}`, payload);
      } else {
        await api.post("/movies", payload);
      }
      fetchMovies();
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving movie:", err);
      alert("Failed to save movie. Make sure you are authorized.");
    }
  };

  // Delete movie
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await api.delete(`/movies/${_id}`);
      fetchMovies();
    } catch (err) {
      console.error("Error deleting movie:", err);
      alert("Failed to delete movie. Make sure you are authorized.");
    }
  };

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
        Admin Panel
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Add New Movie
      </Button>

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
                  onClick={() => handleOpenDialog(movie)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDelete(movie._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEdit ? "Edit Movie" : "Add Movie"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="rank"
            label="Rank *"
            type="number"
            fullWidth
            value={currentMovie.rank}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="title"
            label="Title *"
            fullWidth
            value={currentMovie.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="fullTitle"
            label="Full Title"
            fullWidth
            value={currentMovie.fullTitle}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="year"
            label="Year"
            type="number"
            fullWidth
            value={currentMovie.year}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Poster URL"
            fullWidth
            value={currentMovie.image}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="crew"
            label="Crew"
            fullWidth
            value={currentMovie.crew}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="imDbRating"
            label="IMDb Rating"
            type="number"
            fullWidth
            inputProps={{ step: 0.1 }}
            value={currentMovie.imDbRating}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="imDbRatingCount"
            label="IMDb Rating Count"
            type="number"
            fullWidth
            value={currentMovie.imDbRatingCount}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

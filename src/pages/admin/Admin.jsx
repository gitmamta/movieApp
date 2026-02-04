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
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function Admin() {
  const navigate = useNavigate();

  // Role check
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "ADMIN") {
      navigate("/"); // redirect non-admins
    }
  }, [navigate]);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const res = await api.get("/movies");
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOpenDialog = (movie = null) => {
    if (movie) {
      setIsEdit(true);
      setCurrentMovie(movie);
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

  const handleChange = (e) => {
    setCurrentMovie({ ...currentMovie, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentMovie.rank || !currentMovie.title) {
      alert("Rank and Title are required");
      return;
    }

    const payload = {
      ...currentMovie,
      rank: Number(currentMovie.rank),
      year: currentMovie.year ? Number(currentMovie.year) : null,
      imDbRating: currentMovie.imDbRating ? Number(currentMovie.imDbRating) : null,
      imDbRatingCount: currentMovie.imDbRatingCount ? Number(currentMovie.imDbRatingCount) : null,
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
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await api.delete(`/movies/${_id}`);
      fetchMovies();
    } catch (err) {
      console.error("Error deleting movie:", err);
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
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Add New Movie
      </Button>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
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
                <Button size="small" color="primary" onClick={() => handleOpenDialog(movie)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDelete(movie._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEdit ? "Edit Movie" : "Add Movie"}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="rank" label="Rank *" type="number" fullWidth value={currentMovie.rank} onChange={handleChange} />
          <TextField margin="dense" name="title" label="Title *" fullWidth value={currentMovie.title} onChange={handleChange} />
          <TextField margin="dense" name="fullTitle" label="Full Title" fullWidth value={currentMovie.fullTitle} onChange={handleChange} />
          <TextField margin="dense" name="year" label="Year" type="number" fullWidth value={currentMovie.year} onChange={handleChange} />
          <TextField margin="dense" name="image" label="Poster URL" fullWidth value={currentMovie.image} onChange={handleChange} />
          <TextField margin="dense" name="crew" label="Crew" fullWidth value={currentMovie.crew} onChange={handleChange} />
          <TextField margin="dense" name="imDbRating" label="IMDb Rating" type="number" fullWidth inputProps={{ step: 0.1 }} value={currentMovie.imDbRating} onChange={handleChange} />
          <TextField margin="dense" name="imDbRatingCount" label="IMDb Rating Count" type="number" fullWidth value={currentMovie.imDbRatingCount} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary">{isEdit ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

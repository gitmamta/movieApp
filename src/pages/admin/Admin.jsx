import React, { useEffect, useState } from "react";
import {
  Typography,
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
      const res = await api.get("/movies");
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

  const handleChange = (e) => {
    setCurrentMovie({ ...currentMovie, [e.target.name]: e.target.value });
  };

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
        await api.put(`/admin/movies/${currentMovie._id}`, payload);
      } else {
        await api.post("/admin/movies", payload);
      }
      fetchMovies();
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving movie:", err);
      alert("Failed to save movie. Make sure you are authorized.");
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await api.delete(`/admin/movies/${_id}`);
      fetchMovies();
    } catch (err) {
      console.error("Error deleting movie:", err);
      alert("Failed to delete movie. Make sure you are authorized.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#000", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom color="white" textAlign="center">
        Admin Panel
      </Typography>

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          sx={{ color: "white" }}
        >
          Add New Movie
        </Button>
      </Box>

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
                backgroundColor: "#1c1c1c",
                color: "white",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              {/* Image */}
              {movie.image && (
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    overflow: "hidden",
                    borderBottom: "2px solid #333",
                  }}
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, textAlign: "center", py: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {movie.title}
                </Typography>

                <Typography variant="body2" color="#ccc">
                  Rank: {movie.rank} | Year: {movie.year} | Rating:{" "}
                  {movie.imDbRating || "N/A"}
                </Typography>

                {movie.crew && (
                  <Typography variant="body2" color="#aaa">
                    Crew: {movie.crew}
                  </Typography>
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  size="small"
                  onClick={() => handleOpenDialog(movie)}
                  sx={{ color: "white" }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDelete(movie._id)}
                  sx={{ color: "#ffb400" }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{ sx: { backgroundColor: "#1c1c1c", color: "white" } }}
      >
        <DialogTitle>{isEdit ? "Edit Movie" : "Add Movie"}</DialogTitle>
        <DialogContent>
          {[
            { name: "rank", label: "Rank *", type: "number" },
            { name: "title", label: "Title *", type: "text" },
            { name: "fullTitle", label: "Full Title", type: "text" },
            { name: "year", label: "Year", type: "number" },
            { name: "image", label: "Poster URL", type: "text" },
            { name: "crew", label: "Crew", type: "text" },
            {
              name: "imDbRating",
              label: "IMDb Rating",
              type: "number",
              step: 0.1,
            },
            {
              name: "imDbRatingCount",
              label: "IMDb Rating Count",
              type: "number",
            },
          ].map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              name={field.name}
              label={field.label}
              type={field.type}
              fullWidth
              value={currentMovie[field.name]}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{ style: { color: "white" } }}
              inputProps={field.step ? { step: field.step } : {}}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button onClick={handleSave} sx={{ color: "#ffb400" }}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

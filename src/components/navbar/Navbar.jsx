import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Button,
  InputBase,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/home" },
  
    { label: "Admin", path: "/admin" },
  ];

  // Search handler
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    setSearchInput("");
  };

  const SearchWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    padding: "2px 8px",
    borderRadius: theme.shape.borderRadius,
    "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  }));

  const StyledInput = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    flex: 1,
    "& .MuiInputBase-input": {
      padding: theme.spacing(1),
      width: "100%",
    },
  }));

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IMDb Top Movies
          </Typography>

          {/* Desktop view */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                component={NavLink}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}

            {/* Login & Register */}
            <Button color="inherit" component={NavLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={NavLink} to="/register">
              Register
            </Button>

            {/* Search */}
            <SearchWrapper>
              <StyledInput
                placeholder="Search…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </SearchWrapper>
          </Box>

          {/* Mobile menu icon */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Login & Register mobile */}
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/login"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/register"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>

            {/* Mobile search */}
            <ListItem disablePadding sx={{ px: 2, mt: 1 }}>
              <SearchWrapper style={{ width: "100%" }}>
                <StyledInput
                  placeholder="Search…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    handleSearch();
                    setDrawerOpen(false);
                  }}
                  startIcon={<SearchIcon />}
                >
                  Search
                </Button>
              </SearchWrapper>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

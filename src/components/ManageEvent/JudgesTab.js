import { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

function JudgesTab({ judges, venues, onJudgesChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentJudge, setCurrentJudge] = useState({
    name: "",
    email: "",
  });

  const handleAddJudge = () => {
    setCurrentJudge({ name: "", email: "" });
    setOpenDialog(true);
  };

  const handleSaveJudge = () => {
    if (!currentJudge.name || !currentJudge.email) {
      alert("Judge name and email are required");
      return;
    }

    const token = Math.random().toString(36).substring(2, 15);
    const newJudge = {
      id: currentJudge.id || Date.now(),
      name: currentJudge.name,
      email: currentJudge.email,
      token: currentJudge.token || token,
      createdAt: currentJudge.createdAt || new Date().toISOString(),
    };

    let updatedJudges;
    if (currentJudge.id) {
      updatedJudges = judges.map((j) => (j.id === currentJudge.id ? newJudge : j));
    } else {
      updatedJudges = [...judges, newJudge];
    }

    onJudgesChange(updatedJudges);
    setOpenDialog(false);
  };

  const handleDeleteJudge = (judgeId) => {
    if (window.confirm("Are you sure you want to delete this judge?")) {
      onJudgesChange(judges.filter((j) => j.id !== judgeId));
    }
  };

  const copyTokenToClipboard = (token) => {
    navigator.clipboard.writeText(token);
    alert("Token copied to clipboard!");
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddJudge}>
          Add Judge
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
              }}
            >
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Judge Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Access Token</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {judges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No judges added yet. Click "Add Judge" to get started.
                </TableCell>
              </TableRow>
            ) : (
              judges.map((judge) => (
                <TableRow
                  key={judge.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc"
                    }
                  }}
                >
                  <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{judge.name}</TableCell>
                  <TableCell sx={{ color: "#334155" }}>{judge.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={judge.token || "N/A"}
                      size="small"
                      onClick={() => copyTokenToClipboard(judge.token)}
                      sx={{
                        cursor: "pointer",
                        background: "linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%)",
                        color: "#5b21b6",
                        fontWeight: 600,
                        "&:hover": {
                          background: "linear-gradient(135deg, #c4b5fd 0%, #ddd6fe 100%)"
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCurrentJudge(judge);
                        setOpenDialog(true);
                      }}
                      sx={{
                        color: "#3b82f6",
                        "&:hover": {
                          backgroundColor: "#eff6ff"
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteJudge(judge.id)}
                      sx={{
                        color: "#ef4444",
                        "&:hover": {
                          backgroundColor: "#fef2f2"
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentJudge.id ? "Edit Judge" : "Add New Judge"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Judge Name"
            value={currentJudge.name}
            onChange={(e) => setCurrentJudge({ ...currentJudge, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Judge Email"
            type="email"
            value={currentJudge.email}
            onChange={(e) => setCurrentJudge({ ...currentJudge, email: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              textTransform: "none",
              color: "#7c3aed",
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: "10px",
              background: "rgba(124, 58, 237, 0.08)",
              "&:hover": {
                background: "rgba(124, 58, 237, 0.15)"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveJudge}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              textTransform: "none",
              px: 4,
              py: 1.2,
              fontWeight: 700,
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.35)"
              }
            }}
          >
            {currentJudge.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default JudgesTab;

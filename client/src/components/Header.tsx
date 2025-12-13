import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { FileDownload, RestartAlt } from "@mui/icons-material";

interface HeaderProps {
  onExport: () => void;
  onReset: () => void;
}

export const Header = ({ onExport, onReset }: HeaderProps) => {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          📸 PicsFeed - Vote on Random Pictures
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<FileDownload />}
            onClick={onExport}
            variant="outlined"
            sx={{ borderColor: "white", "&:hover": { borderColor: "white" } }}
          >
            Export to CSV
          </Button>
          <Button
            color="inherit"
            startIcon={<RestartAlt />}
            onClick={onReset}
            variant="outlined"
            sx={{ borderColor: "white", "&:hover": { borderColor: "white" } }}
          >
            Reset Votes
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

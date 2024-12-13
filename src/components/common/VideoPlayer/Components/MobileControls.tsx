import {
  Fullscreen,
  MoreVert as MoreIcon,
  Pause,
  PictureInPicture,
  PlayArrow,
  Refresh,
  VolumeUp,
} from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Slider, Typography } from "@mui/material";
import { useVideoContext } from "./VideoContext.ts";

export const MobileControls = () => {
  const {
    togglePlay,
    reloadVideo,
    onProgressChange,
    videoRef,
    handleMenuOpen,
    handleMenuClose,
    onVolumeChange,
    increaseSpeed,
    togglePictureInPicture,
    toggleFullscreen,
    playing,
    progress,
    anchorEl,
    volume,
    playbackRate,
  } = useVideoContext();

  return (
    <>
      <IconButton
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
        }}
        onClick={() => togglePlay()}
      >
        {playing.value ? <Pause /> : <PlayArrow />}
      </IconButton>
      <IconButton
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
        }}
        onClick={reloadVideo}
      >
        <Refresh />
      </IconButton>
      <Slider
        value={progress.value}
        onChange={onProgressChange}
        min={0}
        max={videoRef.current?.duration || 100}
        sx={{ flexGrow: 1, mx: 2 }}
      />
      <Typography
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "14px",
          userSelect: "none",
          minWidth: "30px",
        }}
        onClick={() => increaseSpeed()}
      >
        {playbackRate}x
      </Typography>

      <Fullscreen onClick={toggleFullscreen} />

      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
        sx={{ minWidth: "30px" }}
      >
        <MoreIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl.value}
        keepMounted
        open={Boolean(anchorEl.value)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            width: "250px",
          },
        }}
      >
        <MenuItem>
          <VolumeUp />
          <Slider
            value={volume.value}
            onChange={onVolumeChange}
            min={0}
            max={1}
            step={0.01}
          />
        </MenuItem>

        <MenuItem onClick={togglePictureInPicture}>
          <PictureInPicture />
        </MenuItem>
      </Menu>
    </>
  );
};

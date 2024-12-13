import {
  Fullscreen,
  Pause,
  PictureInPicture,
  PlayArrow,
  Refresh,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import { IconButton, Slider, Typography, useMediaQuery } from "@mui/material";
import { smallScreenSizeString } from "../../../../constants/Misc.ts";
import { formatTime } from "../../../../utils/numberFunctions.ts";

import { ControlsContainer } from "../VideoPlayer-styles.ts";
import { MobileControls } from "./MobileControls.tsx";
import { useVideoContext } from "./VideoContext.ts";
import { useSignalEffect } from "@preact/signals-react";

export const VideoControls = () => {
  const {
    reloadVideo,
    togglePlay,
    onVolumeChange,
    increaseSpeed,
    togglePictureInPicture,
    toggleFullscreen,
    toggleMute,
    onProgressChange,
    toggleRef,
    from,
    videoRef,
    canPlay,
    isMuted,
    playbackRate,
    playing,
    progress,
    volume,
    showControlsFullScreen,
  } = useVideoContext();

  const isScreenSmall = !useMediaQuery(`(min-width:580px)`);
  const showMobileControls = isScreenSmall && canPlay.value;

  return (
    <ControlsContainer
      style={{ bottom: from === "create" ? "15px" : 0, padding: "0px" }}
      display={showControlsFullScreen.value ? "flex" : "none"}
    >
      {showMobileControls ? (
        <MobileControls />
      ) : canPlay.value ? (
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
              marginLeft: "15px",
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
              fontSize: "14px",
              marginRight: "5px",
              color: "rgba(255, 255, 255, 0.7)",
              visibility:
                !videoRef.current?.duration || !progress.value
                  ? "hidden"
                  : "visible",
            }}
          >
            {progress.value &&
              videoRef.current?.duration &&
              formatTime(progress.value)}
            /
            {progress.value &&
              videoRef.current?.duration &&
              formatTime(videoRef.current?.duration)}
          </Typography>
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              marginRight: "10px",
            }}
            onClick={toggleMute}
          >
            {isMuted.value ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          <Slider
            value={volume.value}
            onChange={onVolumeChange}
            min={0}
            max={1}
            step={0.01}
            sx={{
              maxWidth: "100px",
            }}
          />
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "14px",
              marginLeft: "5px",
            }}
            onClick={e => increaseSpeed()}
          >
            Speed: {playbackRate}x
          </IconButton>

          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              marginLeft: "15px",
            }}
            ref={toggleRef}
            onClick={togglePictureInPicture}
          >
            <PictureInPicture />
          </IconButton>
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
            }}
            onClick={toggleFullscreen}
          >
            <Fullscreen />
          </IconButton>
        </>
      ) : null}
    </ControlsContainer>
  );
};

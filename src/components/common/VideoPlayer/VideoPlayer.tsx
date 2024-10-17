import { useSignals } from "@preact/signals-react/runtime";
import CSS from "csstype";
import { forwardRef } from "react";
import { LoadingVideo } from "./Components/LoadingVideo.tsx";
import {
  showControlsFullScreen,
  useVideoControlsState,
} from "./Components/VideoControls-State.ts";
import { VideoControls } from "./Components/VideoControls.tsx";
import {
  isLoading,
  startPlay,
  useVideoPlayerState,
  videoObjectFit,
} from "./VideoPlayer-State.ts";
import { VideoContainer, VideoElement } from "./VideoPlayer-styles.ts";

export interface VideoStyles {
  videoContainer?: CSS.Properties;
  video?: CSS.Properties;
  controls?: CSS.Properties;
}
export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  name?: string;
  identifier?: string;
  service?: string;
  autoplay?: boolean;
  from?: string | null;
  videoStyles?: VideoStyles;
  user?: string;
  jsonId?: string;
  nextVideo?: any;
  onEnd?: () => void;
  autoPlay?: boolean;
  style?: CSS.Properties;
}

export type refType = {
  getContainerRef: () => React.MutableRefObject<HTMLDivElement>;
  getVideoRef: () => React.MutableRefObject<HTMLVideoElement>;
};
export const VideoPlayer = forwardRef<refType, VideoPlayerProps>(
  (props: VideoPlayerProps, ref) => {
    useSignals();
    const {
      poster,
      identifier,
      autoplay = true,
      from = null,
      videoStyles = {},
    } = props;
    const videoState = useVideoPlayerState(props, ref);
    const {
      containerRef,
      resourceStatus,
      videoRef,
      src,
      updateProgress,
      handleEnded,
      getSrc,
      toggleRef,
    } = videoState;

    const controlState = useVideoControlsState(props, videoRef, videoState);
    const { keyboardShortcutsUp, keyboardShortcutsDown, togglePlay } =
      controlState;

    return (
      <VideoContainer
        tabIndex={0}
        onKeyUp={keyboardShortcutsUp}
        onKeyDown={keyboardShortcutsDown}
        style={{
          padding: from === "create" ? "8px" : 0,
          ...videoStyles?.videoContainer,
        }}
        ref={containerRef}
      >
        <LoadingVideo
          isLoading={isLoading.value}
          resourceStatus={resourceStatus}
          src={src}
          startPlay={startPlay.value}
          from={from}
          togglePlay={togglePlay}
        />
        <VideoElement
          id={identifier}
          ref={videoRef}
          src={
            !startPlay.value
              ? ""
              : resourceStatus?.status === "READY"
              ? src
              : ""
          }
          poster={!startPlay.value ? poster : ""}
          onTimeUpdate={updateProgress}
          autoPlay={autoplay}
          onClick={() => togglePlay()}
          onEnded={handleEnded}
          // onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={controlState.handleCanPlay}
          onMouseEnter={e => {
            showControlsFullScreen.value = true;
          }}
          onMouseLeave={e => {
            showControlsFullScreen.value = false;
          }}
          preload="metadata"
          style={
            startPlay.value
              ? {
                  ...videoStyles?.video,
                  objectFit: videoObjectFit.value,
                }
              : { height: "100%", ...videoStyles }
          }
        />
        <VideoControls
          controlState={controlState}
          videoState={videoState}
          props={props}
          videoRef={videoRef}
        />
      </VideoContainer>
    );
  }
);

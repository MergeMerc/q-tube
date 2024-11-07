import { useSignal, useSignals } from "@preact/signals-react/runtime";
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { setVideoPlaying } from "../../../state/features/globalSlice.ts";
import { StretchVideoType } from "../../../state/features/persistSlice.ts";
import { RootState } from "../../../state/store.ts";
import { MyContext } from "../../../wrappers/DownloadWrapper.tsx";
import { VideoPlayerProps } from "./VideoPlayer.tsx";

export const useVideoPlayerState = (props: VideoPlayerProps, ref: any) => {
  useSignals();
  const persistSelector = useSelector((state: RootState) => state.persist);

  const playing = useSignal(false);
  const isMuted = useSignal(false);
  const progress = useSignal(0);
  const isLoading = useSignal(false);
  const canPlay = useSignal(false);
  const startPlay = useSignal(false);
  const isMobileView = useSignal(false);
  const volume = useSignal(persistSelector.volume);
  const mutedVolume = useSignal(persistSelector.volume);
  const playbackRate = useSignal(persistSelector.playbackRate);
  const anchorEl = useSignal(null);
  const videoObjectFit = useSignal<StretchVideoType>(
    persistSelector.stretchVideoSetting
  );

  const {
    name,
    identifier,
    service,
    user = "",
    jsonId = "",
    nextVideo,
    onEnd,
  } = props;
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { downloads } = useSelector((state: RootState) => state.global);
  const reDownload = useRef<boolean>(false);
  const reDownloadNextVid = useRef<boolean>(false);
  const isFetchingProperties = useRef<boolean>(false);
  const status = useRef<null | string>(null);

  const download = useMemo(() => {
    if (!downloads || !identifier) return {};
    const findDownload = downloads[identifier];

    if (!findDownload) return {};
    return findDownload;
  }, [downloads, identifier]);

  const src = useMemo(() => {
    return download?.url || "";
  }, [download?.url]);

  const resourceStatus = useMemo(() => {
    return download?.status || {};
  }, [download]);

  useImperativeHandle(ref, () => ({
    getVideoRef: () => {
      return videoRef;
    },
    getContainerRef: () => {
      return containerRef;
    },
  }));

  useEffect(() => {
    reDownload.current = false;
    reDownloadNextVid.current = false;
    isLoading.value = false;
    canPlay.value = false;
    progress.value = 0;
    playing.value = false;
    startPlay.value = false;
    isFetchingProperties.current = false;
    status.current = null;
  }, [identifier]);

  const refetch = React.useCallback(async () => {
    if (!name || !identifier || !service || isFetchingProperties.current)
      return;
    try {
      isFetchingProperties.current = true;
      await qortalRequest({
        action: "GET_QDN_RESOURCE_PROPERTIES",
        name,
        service,
        identifier,
      });
    } catch (error) {
      console.log(error);
    } finally {
      isFetchingProperties.current = false;
    }
  }, [identifier, name, service]);

  const toggleRef = useRef<any>(null);
  const { downloadVideo } = useContext(MyContext);

  if (resourceStatus?.status === "READY") {
    canPlay.value = true;
    isLoading.value = false;
    //startPlay.value = true;

    // playing.value = false;
    // videoRef.current.pause();
  }

  const onProgressChange = async (_: any, value: number | number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value as number;
    progress.value = value as number;

    if (!playing.value) {
      await videoRef.current.play();
      playing.value = true;
    }
  };

  const handleEnded = () => {
    playing.value = false;
    if (onEnd) {
      onEnd();
    }
  };

  const updateProgress = () => {
    if (!videoRef.current) return;
    progress.value = videoRef.current.currentTime;
  };

  const getSrc = React.useCallback(async () => {
    if (!name || !identifier || !service || !jsonId || !user) return;
    try {
      downloadVideo({
        name,
        service,
        identifier,
        properties: {
          jsonId,
          user,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [identifier, name, service, jsonId, user]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLeavePictureInPicture = async (event: any) => {
      const target = event?.target;
      if (target) {
        target.pause();
        if (playing.value) {
          playing.value = false;
        }
      }
    };

    if (videoElement) {
      videoElement.addEventListener(
        "leavepictureinpicture",
        handleLeavePictureInPicture
      );
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener(
          "leavepictureinpicture",
          handleLeavePictureInPicture
        );
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    const minimizeVideo = async () => {
      if (!videoElement) return;

      dispatch(setVideoPlaying(videoElement));
    };

    return () => {
      if (videoElement) {
        if (videoElement && !videoElement.paused && !videoElement.ended) {
          minimizeVideo();
        }
      }
    };
  }, []);

  const refetchInInterval = () => {
    try {
      const interval = setInterval(() => {
        if (status?.current === "DOWNLOADED") refetch();
        if (status?.current === "READY") clearInterval(interval);
      }, 7500);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (resourceStatus?.status) {
      status.current = resourceStatus?.status;
    }
    if (
      resourceStatus?.status === "DOWNLOADED" &&
      reDownload?.current === false
    ) {
      refetchInInterval();
      reDownload.current = true;
    }
  }, [getSrc, resourceStatus]);

  useEffect(() => {
    if (resourceStatus?.status) {
      status.current = resourceStatus?.status;
    }
    if (
      resourceStatus?.status === "READY" &&
      reDownloadNextVid?.current === false
    ) {
      if (nextVideo) {
        downloadVideo({
          name: nextVideo?.name,
          service: nextVideo?.service,
          identifier: nextVideo?.identifier,
          properties: {
            jsonId: nextVideo?.jsonId,
            user,
          },
        });
      }
      reDownloadNextVid.current = true;
    }
  }, [getSrc, resourceStatus]);

  const handleMenuOpen = (event: any) => {
    anchorEl.value = event.currentTarget;
  };

  const handleMenuClose = () => {
    anchorEl.value = null;
  };

  return {
    containerRef,
    resourceStatus,
    videoRef,
    src,
    getSrc,
    updateProgress,
    handleEnded,
    onProgressChange,
    handleMenuOpen,
    handleMenuClose,
    toggleRef,
    playing,
    isMuted,
    progress,
    isLoading,
    canPlay,
    startPlay,
    isMobileView,
    volume,
    mutedVolume,
    playbackRate,
    anchorEl,
    videoObjectFit,
  };
};

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, Lock, CheckCircle2 } from 'lucide-react';
import {
  VideoLesson,
  VideoSegment,
  VideoSegmentProgress,
} from '../services/video-learning.service';

interface VideoPlayerProps {
  lesson: VideoLesson;
  segments: VideoSegment[];
  progress: VideoSegmentProgress[];
  activeSegment: VideoSegment | null;
  onSegmentEnd: () => void;
}

const getYouTubeId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || null;
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      return (
        parsed.searchParams.get('v') ||
        parsed.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ||
        null
      );
    }
  } catch {
    return null;
  }

  return null;
};

const loadYouTubeApi = (): Promise<any> =>
  new Promise((resolve, reject) => {
    const w = window as any;

    if (w.YT?.Player) {
      resolve(w.YT);
      return;
    }

    const previousCallback = w.onYouTubeIframeAPIReady;

    w.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') {
        previousCallback();
      }

      if (w.YT?.Player) {
        resolve(w.YT);
      } else {
        reject(new Error('YouTube player API could not initialize.'));
      }
    };

    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
  });

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lesson,
  segments,
  progress,
  activeSegment,
  onSegmentEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const onSegmentEndRef = useRef(onSegmentEnd);
  const segmentEndHandledRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState('');

  const videoUrl = activeSegment?.videoUrl || lesson.videoUrl;
  const youtubeId = getYouTubeId(videoUrl);
  const isYouTube = Boolean(youtubeId);

  const activeProgress = progress.find(
    (item) => item.segmentId === activeSegment?.id,
  );

  useEffect(() => {
    onSegmentEndRef.current = onSegmentEnd;
  }, [onSegmentEnd]);

  const finishSegment = () => {
    if (segmentEndHandledRef.current) return;

    segmentEndHandledRef.current = true;
    setPlaying(false);
    onSegmentEndRef.current();
  };

  useEffect(() => {
    if (!activeSegment) return;

    segmentEndHandledRef.current = false;
    setPlaying(false);
    setCurrentTime(activeSegment.startTime);
    setDuration(0);
    setVideoError('');
  }, [activeSegment?.id]);

  // YouTube playback
  useEffect(() => {
    if (!activeSegment || !isYouTube || !youtubeId) return;

    let cancelled = false;
    let player: any = null;
    let monitor: number | undefined;

    const clearMonitor = () => {
      if (monitor !== undefined) {
        window.clearInterval(monitor);
        monitor = undefined;
      }
    };

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !youtubeContainerRef.current) return;

        player = new YT.Player(youtubeContainerRef.current, {
          width: '100%',
          height: '100%',
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            playsinline: 1,
            start: Math.floor(activeSegment.startTime),
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (cancelled) return;

              event.target.seekTo(activeSegment.startTime, true);
              setDuration(event.target.getDuration() || 0);
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (cancelled) return;

              if (event.data === YT.PlayerState.PLAYING) {
                setPlaying(true);
                clearMonitor();

                monitor = window.setInterval(() => {
                  const time = player?.getCurrentTime?.() || 0;
                  setCurrentTime(time);

                  const videoDuration = player?.getDuration?.() || 0;
                  if (videoDuration) setDuration(videoDuration);

                  if (time >= activeSegment.endTime) {
                    clearMonitor();
                    player.pauseVideo();
                    player.seekTo(activeSegment.endTime, true);
                    setCurrentTime(activeSegment.endTime);
                    finishSegment();
                  }
                }, 250);
              }

              if (event.data === YT.PlayerState.PAUSED) {
                setPlaying(false);
                clearMonitor();
              }

              if (event.data === YT.PlayerState.ENDED) {
                clearMonitor();
                setCurrentTime(activeSegment.endTime);
                finishSegment();
              }
            },
            onError: () => {
              setPlaying(false);
              setVideoError(
                'YouTube could not play this video. It may be private, unavailable, or restricted from embedding.',
              );
            },
          },
        });

        youtubePlayerRef.current = player;
      })
      .catch(() => {
        if (!cancelled) {
          setVideoError('Could not load the YouTube player. Check your internet connection.');
        }
      });

    return () => {
      cancelled = true;
      clearMonitor();

      if (player) {
        player.destroy();
      }

      youtubePlayerRef.current = null;
    };
  }, [activeSegment?.id, videoUrl, isYouTube, youtubeId]);

  // Direct MP4 playback
  useEffect(() => {
    if (!activeSegment || isYouTube) return;

    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const seekToSegment = () => {
      if (!videoRef.current) return;

      video.currentTime = activeSegment.startTime;
      setCurrentTime(activeSegment.startTime);

      video.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    if (video.readyState >= 1) {
      seekToSegment();
    } else {
      video.addEventListener('loadedmetadata', seekToSegment, { once: true });
    }

    return () => {
      video.removeEventListener('loadedmetadata', seekToSegment);
    };
  }, [activeSegment?.id, videoUrl, isYouTube]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !activeSegment) return;

    setCurrentTime(video.currentTime);

    if (video.currentTime >= activeSegment.endTime) {
      video.pause();
      video.currentTime = activeSegment.endTime;
      finishSegment();
    }
  };

  const togglePlayback = async () => {
    if (isYouTube) {
      const player = youtubePlayerRef.current;
      if (!player) return;

      if (playing) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }

      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setVideoError('Playback could not start. Check the video URL.');
      }
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  if (!activeSegment) {
    return (
      <div className="aspect-video bg-[#2D1B0E] rounded-2xl flex items-center justify-center text-[#F3E8D2]">
        <p>Select an unlocked segment to begin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-black">
        {isYouTube ? (
          <div className="w-full aspect-video">
            <div
              ref={youtubeContainerRef}
              className="w-full h-full"
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full aspect-video"
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(event) =>
              setDuration(event.currentTarget.duration)
            }
            onEnded={() => {
              setCurrentTime(activeSegment.endTime);
              finishSegment();
            }}
            onError={() => {
              setPlaying(false);
              setVideoError(
                'This video could not be loaded. Check that its URL is publicly accessible and supports browser playback.',
              );
            }}
            controls={false}
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3 text-white">
            <button
              onClick={() => void togglePlayback()}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30"
              aria-label={playing ? 'Pause video' : 'Play video'}
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <Volume2 size={18} />

            <span className="text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <span className="ml-auto text-xs font-semibold">
              Segment {activeSegment.segmentOrder}
            </span>
          </div>
        </div>
      </div>

      {videoError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {videoError}
        </div>
      )}

      <div className="paper rounded-2xl p-5">
        <h3 className="font-heading font-bold text-lg text-matti">
          {activeSegment.title}
        </h3>

        <p className="text-sm text-matti-light mt-1">
          Watch this segment, then complete its quiz to unlock the next one.
        </p>

        <div className="mt-3 text-xs text-matti-light">
          Required quiz score: {activeSegment.passingScore}%

          {activeProgress?.completed && (
            <span className="ml-3 text-green-700 font-semibold">
              <CheckCircle2 className="inline w-4 h-4 mr-1" />
              Completed · Score {activeProgress.quizScore ?? 0}%
            </span>
          )}
        </div>
      </div>

      <div className="paper rounded-2xl p-5">
        <h3 className="font-heading font-bold text-matti mb-3">
          Lesson segments
        </h3>

        <div className="space-y-2">
          {segments.map((segment) => {
            const item = progress.find(
              (entry) => entry.segmentId === segment.id,
            );

            const unlocked = item?.unlocked ?? segment.segmentOrder === 1;
            const completed = item?.completed ?? false;
            const selected = segment.id === activeSegment.id;

            return (
              <div
                key={segment.id}
                className={`flex items-center justify-between rounded-xl p-3 border ${
                  selected
                    ? 'border-terracotta bg-terracotta/5'
                    : 'border-parchment-dark bg-cream'
                }`}
              >
                <div className="flex items-center gap-3">
                  {completed ? (
                    <CheckCircle2 className="text-green-700" size={19} />
                  ) : !unlocked ? (
                    <Lock className="text-matti-light" size={19} />
                  ) : (
                    <Play className="text-terracotta" size={19} />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-matti">
                      {segment.segmentOrder}. {segment.title}
                    </p>

                    <p className="text-xs text-matti-light">
                      {formatTime(segment.startTime)} – {formatTime(segment.endTime)}
                      {completed ? ` · Score ${item?.quizScore ?? 0}%` : ''}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-matti-light">
                  {completed ? 'Completed' : unlocked ? 'Available' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

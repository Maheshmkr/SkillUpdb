import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseById } from "@/api/courseApi";
import { getUserProgress, updateCourseProgress } from "@/api/userApi";
import {
  ArrowLeft, Bell, Play, Pause, RotateCcw, FastForward, Settings,
  Maximize, ChevronDown, CircleCheck, CirclePlay, Circle, Lock,
  FileEdit, Download, ArrowRight, Trophy
} from "lucide-react";

// Helper to format YouTube URLs for Embedding
const getEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) return url;

  let videoId = null;
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
  }
  return url;
};

export default function LearningInterface() {
  const { courseId: id } = useParams();
  const queryClient = useQueryClient();
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [openModules, setOpenModules] = useState({ 0: true });
  const playerRef = useRef(null);

  // 1. Load YouTube IFrame API
  useEffect(() => {
    // Only load the script if it doesn't exist
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // 2. Fetch Course Content
  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      return await getCourseById(id);
    }
  });

  // 3. Fetch User Progress
  const { data: progressData, isLoading: loadingProgress } = useQuery({
    queryKey: ['progress', id],
    queryFn: async () => {
      return await getUserProgress(id);
    }
  });

  const modules = course?.modules || [];
  const completedLessons = progressData?.completedLessons || [];
  const courseProgress = progressData?.progress || 0;

  // Set initial active lesson
  useEffect(() => {
    if (modules.length > 0 && !activeLesson) {
      const firstLesson = modules[0].lessons[0];
      setActiveLesson(firstLesson);
      setCurrentVideo(firstLesson.videoUrl);
    }
  }, [modules, activeLesson]);

  // Handle player state changes
  useEffect(() => {
    // This function depends on the activeLesson and currentVideo
    const onPlayerStateChange = (event) => {
      // YT.PlayerState.ENDED is 0
      if (event.data === 0) {
        console.log("Video ended, marking lesson as complete:", activeLesson?.title);
        handleLessonComplete();
      }
    };

    const initializePlayer = () => {
      if (window.YT && window.YT.Player && currentVideo) {
        const iframe = document.getElementById('youtube-player');
        if (iframe) {
          // If player already exists, destroy it first or just update listeners
          if (playerRef.current) {
            playerRef.current.destroy();
          }

          playerRef.current = new window.YT.Player('youtube-player', {
            events: {
              'onStateChange': onPlayerStateChange
            }
          });
        }
      }
    };

    // If API is already ready, initialize
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      // Or wait for it to be ready
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      // Cleanup would go here if needed
    };
  }, [currentVideo, activeLesson]);

  // Handle progress update
  const completeMutation = useMutation({
    mutationFn: async (lessonTitle) => {
      return await updateCourseProgress({
        courseId: id,
        lessonTitle
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['progress', id]);
      if (data.isCompleted) {
        alert("🎉 Congratulations! Course 100% Complete. Certificate available in Profile.");
      } else {
        handleNextLesson();
      }
    }
  });

  const handleNextLesson = () => {
    // Flat list of all lessons
    const allLessons = modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.title === activeLesson?.title);

    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setActiveLesson(nextLesson);
      setCurrentVideo(nextLesson.videoUrl);

      // Also open the next module if it's closed
      const nextModuleIndex = modules.findIndex(m => m.lessons.some(l => l.title === nextLesson.title));
      if (nextModuleIndex !== -1) {
        setOpenModules(prev => ({ ...prev, [nextModuleIndex]: true }));
      }
    }
  };

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
    setCurrentVideo(lesson.videoUrl);
  };

  const handleLessonComplete = () => {
    if (!activeLesson) return;
    // Don't re-mark if already completed
    if (completedLessons.includes(activeLesson.title)) return;

    completeMutation.mutate(activeLesson.title);
  };

  const toggleModule = (idx) => {
    setOpenModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  if (loadingCourse || loadingProgress) return <div className="p-10 text-center text-white bg-foreground min-h-screen">Loading learning interface...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Nav */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to={`/course/${course._id}`} className="flex items-center gap-2 text-primary">
            <ArrowLeft className="size-5" />
            <span className="hidden md:inline font-medium">Course Details</span>
          </Link>
          <div className="h-6 w-px bg-border mx-2" />
          <h1 className="text-lg font-semibold truncate max-w-[300px] md:max-w-md">{course.title}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end gap-1 min-w-[150px]">
            <div className="flex justify-between w-full text-xs font-medium">
              <span>Course Progress</span>
              <span>{courseProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground">
              <Bell className="size-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              AM
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col relative bg-foreground">
          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center relative group bg-black">
            {currentVideo ? (
              <iframe
                id="youtube-player"
                width="100%"
                height="100%"
                src={getEmbedUrl(currentVideo)}
                title="Course Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${course?.image})` }}
              >
                <div className="absolute inset-0 bg-foreground/30" />
                <button className="z-20 w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110">
                  <Play className="size-10 fill-current" />
                </button>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="bg-card border-t border-border p-4 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-semibold transition-colors">
                <FileEdit className="size-4" /> Take Notes
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLessonComplete}
                disabled={completeMutation.isPending || (activeLesson && completedLessons.includes(activeLesson.title))}
                className={`px-6 py-2 text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95 ${activeLesson && completedLessons.includes(activeLesson.title)
                  ? "bg-success/20 text-success cursor-default"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                  }`}
              >
                {activeLesson && completedLessons.includes(activeLesson.title) ? (
                  <>Completed <CircleCheck className="size-4" /></>
                ) : (
                  <>{completeMutation.isPending ? "Updating..." : "Complete Lesson"} <CircleCheck className="size-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-96 border-l border-border bg-card flex flex-col overflow-hidden hidden lg:flex">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-lg">Course Content</h3>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
              {completedLessons.length} of {totalLessons} lessons completed
            </p>
          </div>
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {modules.map((mod, idx) => (
              <details key={idx} open={openModules[idx]} className="group">
                <summary
                  onClick={(e) => { e.preventDefault(); toggleModule(idx); }}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50 list-none border-b border-border"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform ${openModules[idx] ? "rotate-180" : ""}`} />
                    <span className="font-semibold text-sm">{mod.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{mod.lessons.length} lessons</span>
                </summary>
                <div className="bg-secondary/30">
                  {mod.lessons.map((lesson, li) => {
                    const isCompleted = completedLessons.includes(lesson.title);
                    const isActive = activeLesson?.title === lesson.title;
                    return (
                      <div
                        key={li}
                        onClick={() => handleLessonClick(lesson)}
                        className={`flex items-center justify-between px-6 py-4 cursor-pointer border-l-4 transition-colors ${isActive ? "bg-accent border-l-primary" : "hover:bg-secondary border-l-transparent opacity-70"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          {isCompleted ? (
                            <CircleCheck className="size-5 text-success" />
                          ) : isActive ? (
                            <CirclePlay className="size-5 text-primary" />
                          ) : (
                            <Circle className="size-5 text-muted-foreground" />
                          )}
                          <div>
                            <p className={`text-sm ${isActive ? "font-bold text-primary" : "font-medium"}`}>
                              {lesson.title}
                            </p>
                            <p className={`text-xs ${isActive ? "text-primary/70" : "text-muted-foreground"}`}>
                              {lesson.type || "Video"} • {lesson.duration}
                            </p>
                          </div>
                        </div>
                        {isActive && !isCompleted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground uppercase">Playing</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

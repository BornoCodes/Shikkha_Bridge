import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  videoLearningService,
  VideoLesson,
} from '../services/video-learning.service';

export const VideoLessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<VideoLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLessons = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await videoLearningService.getPublishedLessons();
      const data = response.data as unknown as VideoLesson[];
      setLessons(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Could not load video lessons.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLessons();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-matti">
          Video Lessons
        </h1>
        <p className="text-sm text-matti-light mt-1">
          Watch lessons, complete segment quizzes, and unlock the next part as you learn.
        </p>
      </div>

      {loading && (
        <div className="paper rounded-2xl p-10 text-center">
          <RefreshCw className="w-7 h-7 animate-spin text-terracotta mx-auto mb-3" />
          <p className="text-sm text-matti-light">Loading published lessons...</p>
        </div>
      )}

      {!loading && error && (
        <div className="paper rounded-2xl p-8 text-center">
          <p className="text-matti font-semibold mb-2">
            Unable to load lessons
          </p>
          <p className="text-sm text-matti-light mb-4">{error}</p>
          <button
            onClick={() => void loadLessons()}
            className="px-5 py-2 rounded-xl bg-terracotta text-white text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && lessons.length === 0 && (
        <div className="paper rounded-2xl p-10 text-center">
          <BookOpen className="w-12 h-12 text-terracotta mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-matti mb-2">
            No published video lessons yet
          </h2>
          <p className="text-sm text-matti-light max-w-lg mx-auto">
            Your video lessons will appear here once a teacher adds a video,
            creates its segments, and publishes the lesson.
          </p>
        </div>
      )}

      {!loading && !error && lessons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <article
              key={lesson.id}
              className="paper rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-[#2D1B0E] flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-[#F3E8D2]" />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-terracotta mb-2">
                  {typeof lesson.topic?.subject === 'string'
                    ? lesson.topic.subject
                    : lesson.topic?.subject?.name || 'Video lesson'}
                </p>

                <h2 className="font-heading text-xl font-bold text-matti mb-2">
                  {lesson.title}
                </h2>

                <p className="text-sm text-matti-light leading-relaxed mb-4 flex-1">
                  {lesson.description || 'Watch this lesson and complete its segment quizzes.'}
                </p>

                <div className="flex items-center gap-2 text-xs text-matti-light mb-4">
                  <Clock className="w-4 h-4" />
                  <span>
                    {lesson.segments?.length ?? 'Multiple'} learning segments
                  </span>
                </div>

                <Link
                  to={`/student/videos/${lesson.id}`}
                  className="w-full text-center bg-terracotta hover:bg-[#A93C27] text-white rounded-xl py-3 px-4 text-sm font-semibold no-underline transition-colors"
                >
                  Watch Lesson
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

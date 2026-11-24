
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Lock, CheckCircle2, PlayCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  videoLearningService,
  VideoLesson,
  VideoSegment,
  VideoSegmentProgress,
} from '../services/video-learning.service';
import { VideoPlayer } from '../components/VideoPlayer';
import { Assessment, AssessmentQuestion } from '../../../shared/types';

export const VideoLessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();

  const [lesson, setLesson] = useState<VideoLesson | null>(null);
  const [progress, setProgress] = useState<VideoSegmentProgress[]>([]);
  const [activeSegment, setActiveSegment] = useState<VideoSegment | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [result, setResult] = useState<string>('');
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const loadLesson = useCallback(async () => {
    if (!lessonId) return;

    setLoading(true);
    try {
      const [lessonResponse, progressResponse] = await Promise.all([
        videoLearningService.getLesson(lessonId),
        videoLearningService.getLessonProgress(lessonId),
      ]);

      const lessonData = lessonResponse.data as unknown as VideoLesson;
      const progressData = progressResponse.data as unknown as VideoSegmentProgress[];

      setLesson(lessonData);
      setProgress(Array.isArray(progressData) ? progressData : []);

      if (!activeSegment && lessonData.segments?.length) {
        const firstUnlocked = lessonData.segments.find((segment) =>
          progressData.some((item) =>
            item.segmentId === segment.id && item.unlocked,
          ),
        );

        if (firstUnlocked) {
          setActiveSegment(firstUnlocked);
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Could not load this video lesson.',
      );
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    void loadLesson();
  }, [loadLesson]);

  const selectSegment = async (segment: VideoSegment) => {
    const item = progress.find((entry) => entry.segmentId === segment.id);
    const unlocked = item?.unlocked ?? segment.segmentOrder === 1;

    if (!unlocked) {
      toast.error('Complete the previous segment quiz to unlock this segment.');
      return;
    }

    try {
      await videoLearningService.startSegment(segment.id);
      setActiveSegment(segment);
      setAssessment(null);
      setAnswers({});
      setShowQuiz(false);
      setResult('');
      setLessonCompleted(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'This segment is not unlocked yet.',
      );
    }
  };

  const generateQuiz = async () => {
    if (!lesson || !activeSegment) return;

    setQuizLoading(true);
    setResult('');

    try {
      const response = await videoLearningService.generateSegmentQuiz(
        lesson.topicId,
        activeSegment.id,
        'medium',
        5,
      );

      setAssessment(response.data as unknown as Assessment);
      setAnswers({});
      setShowQuiz(true);
      toast.success('Your segment quiz is ready.');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Could not generate the segment quiz.',
      );
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!assessment) return;

    const questions = assessment.questions || [];

    if (questions.some((question) => !answers[question.id])) {
      toast.error('Please answer every question before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await videoLearningService.submitSegmentQuiz(
        assessment.id,
        questions.map((question) => ({
          questionId: question.id,
          answer: answers[question.id],
        })),
      );

      const quizResult = response.data;
      const passed = quizResult.videoProgress?.passed ?? false;

      const isFinalSegment =
        activeSegment?.id ===
        lesson?.segments?.[lesson.segments.length - 1]?.id;

      setResult(
        `You scored ${quizResult.score}%. ${
          passed
            ? isFinalSegment
              ? 'Congratulations! You have completed all segments of this lesson!'
              : 'Well done! The next segment is now unlocked.'
            : `You need ${
                quizResult.videoProgress?.passingScore ??
                activeSegment?.passingScore ??
                70
              }% to pass. Review this segment and try again.`
        }`,
      );

      setAssessment(null);
      setShowQuiz(false);
      setAnswers({});

      if (passed && isFinalSegment) {
        setLessonCompleted(true);
      }

      await loadLesson();

      if (passed && !isFinalSegment && quizResult.videoProgress?.nextSegmentId) {
        const nextSegment = lesson?.segments?.find(
          (segment) =>
            segment.id === quizResult.videoProgress?.nextSegmentId,
        );

        if (nextSegment) {
          setActiveSegment(nextSegment);

          try {
            await videoLearningService.startSegment(nextSegment.id);
          } catch {
            // Progress refresh will still show the newly unlocked segment.
          }
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Could not submit your quiz.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="paper rounded-2xl p-10 text-center">
        <RefreshCw className="w-7 h-7 animate-spin text-terracotta mx-auto mb-3" />
        <p className="text-sm text-matti-light">Loading your lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="paper rounded-2xl p-8 text-center">
        <h2 className="font-heading text-xl font-bold text-matti mb-2">
          Lesson unavailable
        </h2>
        <Link to="/student/videos" className="text-terracotta underline">
          Back to video lessons
        </Link>
      </div>
    );
  }

  const segments = lesson.segments || [];

  return (
    <div className="space-y-6">
      <Link
        to="/student/videos"
        className="inline-flex items-center gap-2 text-sm text-terracotta no-underline"
      >
        <ArrowLeft size={17} />
        Back to video lessons
      </Link>

      <div>
        <p className="text-xs uppercase tracking-wide font-semibold text-terracotta">
          {typeof lesson.topic?.subject === 'string'
            ? lesson.topic.subject
            : lesson.topic?.subject?.name || 'Video learning'}
        </p>

        <h1 className="font-heading text-3xl font-bold text-matti mt-1">
          {lesson.title}
        </h1>

        <p className="text-sm text-matti-light mt-2">
          {lesson.description}
        </p>
      </div>

      {lessonCompleted ? (
        <div className="paper rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-700 mx-auto" />

          <h2 className="font-heading text-2xl font-bold text-matti">
            Congratulations!
          </h2>

          <p className="text-matti-light">
            You have successfully completed all segments of this video lesson.
          </p>

          <p className="text-sm font-semibold text-green-700">
            All segments completed!
          </p>

          <Link
            to="/student/videos"
            className="inline-block px-5 py-3 rounded-xl bg-terracotta text-white text-sm font-semibold no-underline"
          >
            Back to video lessons
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <VideoPlayer
              lesson={lesson}
              segments={segments}
              progress={progress}
              activeSegment={activeSegment}
              onSegmentEnd={() => {
                setShowQuiz(false);
                setAssessment(null);
              }}
            />

            {activeSegment && (
              <div className="paper rounded-2xl p-5">
                <h3 className="font-heading text-lg font-bold text-matti mb-2">
                  Segment quiz
                </h3>

                <p className="text-sm text-matti-light mb-4">
                  Finish watching this segment, then generate its quiz. Pass the
                  quiz to unlock the next segment.
                </p>

                <button
                  onClick={() => void generateQuiz()}
                  disabled={quizLoading}
                  className="px-5 py-3 rounded-xl bg-terracotta text-white text-sm font-semibold disabled:opacity-50"
                >
                  {quizLoading ? 'Preparing quiz...' : 'Start segment quiz'}
                </button>
              </div>
            )}

            {showQuiz && assessment && (
              <div className="paper rounded-2xl p-5 space-y-5">
                <h3 className="font-heading text-xl font-bold text-matti">
                  {assessment.title || 'Segment quiz'}
                </h3>

                {assessment.questions?.map(
                  (question: AssessmentQuestion, index) => (
                    <div
                      key={question.id}
                      className="border-b border-parchment-dark pb-4"
                    >
                      <p className="font-semibold text-matti mb-3">
                        {index + 1}. {question.text || (question as any).question || 'Question unavailable'}
                      </p>

                      <div className="space-y-2">
                        {(question.options || []).map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 p-3 rounded-xl bg-cream border border-parchment-dark cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={() =>
                                setAnswers((previous) => ({
                                  ...previous,
                                  [question.id]: option,
                                }))
                              }
                            />

                            <span className="text-sm text-matti">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ),
                )}

                <button
                  onClick={() => void submitQuiz()}
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl bg-terracotta text-white text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit quiz'}
                </button>
              </div>
            )}

            {result && (
              <div className="paper rounded-2xl p-5">
                <p className="text-sm font-semibold text-matti">
                  {result}
                </p>
              </div>
            )}
          </div>

          <aside className="paper rounded-2xl p-5 h-fit">
            <h2 className="font-heading text-xl font-bold text-matti mb-4">
              Your learning progress
            </h2>

            <p className="text-xs text-matti-light mb-4">
              {progress.filter((item) => item.completed).length} of{' '}
              {segments.length} segments completed
            </p>

            <div className="space-y-3">
              {segments.map((segment) => {
                const item = progress.find(
                  (entry) => entry.segmentId === segment.id,
                );

                const unlocked =
                  item?.unlocked ?? segment.segmentOrder === 1;

                const completed = item?.completed ?? false;
                const selected = activeSegment?.id === segment.id;

                return (
                  <button
                    key={segment.id}
                    onClick={() => void selectSegment(segment)}
                    disabled={!unlocked}
                    className={`w-full text-left rounded-xl p-3 border transition-colors ${
                      selected
                        ? 'border-terracotta bg-terracotta/5'
                        : 'border-parchment-dark bg-cream'
                    } ${
                      !unlocked
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:border-terracotta'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {completed ? (
                        <CheckCircle2
                          className="text-green-700 shrink-0"
                          size={18}
                        />
                      ) : !unlocked ? (
                        <Lock
                          className="text-matti-light shrink-0"
                          size={18}
                        />
                      ) : (
                        <PlayCircle
                          className="text-terracotta shrink-0"
                          size={18}
                        />
                      )}

                      <span className="text-sm font-semibold text-matti">
                        {segment.segmentOrder}. {segment.title}
                      </span>
                    </div>

                    <p className="text-xs text-matti-light mt-2 ml-6">
                      {completed
                        ? `Completed · ${item?.quizScore ?? 0}%`
                        : unlocked
                          ? 'Unlocked'
                          : 'Pass the previous quiz to unlock'}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

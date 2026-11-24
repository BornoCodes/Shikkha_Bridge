
import React, { useEffect, useState } from 'react';
import {
  videoLearningService,
  VideoLesson,
  VideoSegment,
  VideoTopic,
} from '../services/video-learning.service';

const inputClass =
  'w-full rounded-lg border border-[#D8C4AE] bg-white px-3 py-2 text-sm text-[#2D1B0E] focus:outline-none focus:ring-2 focus:ring-[#C84B31]';

const buttonClass =
  'rounded-lg bg-[#C84B31] px-4 py-2 text-sm font-medium text-white hover:bg-[#A83C27] disabled:cursor-not-allowed disabled:opacity-50';

const secondaryButtonClass =
  'rounded-lg border border-[#D8C4AE] px-4 py-2 text-sm font-medium text-[#6B5344] hover:bg-[#F5E9D9] disabled:opacity-50';

function responseData<T>(response: any): T {
  return response?.data ?? response;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

export const TeacherVideoLessonsPage: React.FC = () => {
  const [topics, setTopics] = useState<VideoTopic[]>([]);
  const [lessons, setLessons] = useState<VideoLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [topicId, setTopicId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [selectedLessonId, setSelectedLessonId] = useState('');

  const [segmentTitle, setSegmentTitle] = useState('');
  const [startTime, setStartTime] = useState('0');
  const [endTime, setEndTime] = useState('60');
  const [passingScore, setPassingScore] = useState('70');
  const [learningContent, setLearningContent] = useState('');

  const [editingSegmentId, setEditingSegmentId] = useState('');
  const [editingContent, setEditingContent] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [topicResponse, lessonResponse] = await Promise.all([
        videoLearningService.getTopics(),
        videoLearningService.getTeacherLessons(),
      ]);

      setTopics(responseData<VideoTopic[]>(topicResponse));
      setLessons(responseData<VideoLesson[]>(lessonResponse));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not load video lessons and curriculum topics.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedLesson = lessons.find(
    (lesson) => lesson.id === selectedLessonId,
  );

  const createLesson = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!topicId || !lessonTitle.trim() || !videoUrl.trim()) {
      setError('Please select a topic and enter a lesson title and video URL.');
      return;
    }

    setSaving(true);

    try {
      const response = await videoLearningService.createLesson({
        topicId,
        title: lessonTitle.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
      });

      const lesson = responseData<VideoLesson>(response);

      setLessonTitle('');
      setDescription('');
      setVideoUrl('');
      setTopicId('');
      setSelectedLessonId(lesson.id);

      setSuccess('Lesson created. Now add its video segments and learning content.');
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Could not create lesson.',
      );
    } finally {
      setSaving(false);
    }
  };

  const createSegment = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedLesson) {
      setError('Select a lesson first.');
      return;
    }

    const start = Number(startTime);
    const end = Number(endTime);
    const score = Number(passingScore);

    if (
      !segmentTitle.trim() ||
      !learningContent.trim() ||
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 0 ||
      end <= start ||
      !Number.isInteger(score) ||
      score < 0 ||
      score > 100
    ) {
      setError(
        'Enter a title, learning content, valid whole-number times, and a passing score from 0 to 100.',
      );
      return;
    }

    setSaving(true);

    try {
      const nextOrder = (selectedLesson.segments?.length ?? 0) + 1;

      await videoLearningService.createSegment(selectedLesson.id, {
        title: segmentTitle.trim(),
        startTime: start,
        endTime: end,
        segmentOrder: nextOrder,
        passingScore: score,
        learningContent: learningContent.trim(),
      });

      setSegmentTitle('');
      setStartTime(String(end));
      setEndTime(String(end + 60));
      setPassingScore('70');
      setLearningContent('');

      setSuccess('Segment added successfully.');
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Could not add segment.',
      );
    } finally {
      setSaving(false);
    }
  };

  const saveSegmentContent = async (segmentId: string) => {
    setError('');
    setSuccess('');

    if (!editingContent.trim()) {
      setError('Learning content cannot be empty.');
      return;
    }

    setSaving(true);

    try {
      await videoLearningService.updateSegmentContent(
        segmentId,
        editingContent.trim(),
      );

      setEditingSegmentId('');
      setEditingContent('');
      setSuccess('Segment learning content updated successfully.');
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not update learning content.',
      );
    } finally {
      setSaving(false);
    }
  };

  const publishLesson = async (lesson: VideoLesson) => {
    setError('');
    setSuccess('');

    if (!lesson.segments?.length) {
      setError('Add at least one segment before publishing.');
      return;
    }

    if (
      !window.confirm(
        `Publish "${lesson.title}"? Students will be able to access this lesson.`,
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      await videoLearningService.publishLesson(lesson.id);
      setSuccess('Lesson published successfully.');
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not publish lesson.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-[#6B5344]">
        Loading teacher video lessons...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 text-[#2D1B0E]">
      <header>
        <p className="text-sm font-medium uppercase tracking-wider text-[#C84B31]">
          Teacher workspace
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Video Lessons</h1>
        <p className="mt-2 text-sm text-[#6B5344]">
          Create curriculum-based video lessons, divide videos into segments,
          and provide learning content for AI-generated quizzes.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <section className="rounded-xl border border-[#EAD5BC] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">1. Create a video lesson</h2>

        <form onSubmit={createLesson} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Curriculum topic
            </label>
            <select
              className={inputClass}
              value={topicId}
              onChange={(event) => setTopicId(event.target.value)}
              required
            >
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.subject?.name
                    ? `${topic.subject.name} — `
                    : ''}
                  {topic.name}
                  {topic.subject?.classLevel
                    ? ` (Class ${topic.subject.classLevel})`
                    : ''}
                </option>
              ))}
            </select>
            {topics.length === 0 && (
              <p className="mt-1 text-xs text-amber-700">
                No curriculum topics were returned. Add topics to the curriculum
                before creating a lesson.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Lesson title
            </label>
            <input
              className={inputClass}
              value={lessonTitle}
              onChange={(event) => setLessonTitle(event.target.value)}
              placeholder="e.g. Introduction to Photosynthesis"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              className={inputClass}
              rows={2}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What will students learn?"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Video URL (YouTube or MP4)
            </label>
            <input
              className={inputClass}
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
              required
            />
          </div>

          <button className={buttonClass} disabled={saving || topics.length === 0}>
            {saving ? 'Creating...' : 'Create lesson'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-[#EAD5BC] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">2. Add video segments</h2>
        <p className="mt-1 text-sm text-[#6B5344]">
          Times are in seconds. For example, 90 means 1 minute 30 seconds.
          Add meaningful learning content so the AI can generate relevant
          questions instead of generic placeholders.
        </p>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">
            Select lesson
          </label>
          <select
            className={inputClass}
            value={selectedLessonId}
            onChange={(event) => setSelectedLessonId(event.target.value)}
          >
            <option value="">Select a lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title} {lesson.published ? '(Published)' : '(Draft)'}
              </option>
            ))}
          </select>
        </div>

        {selectedLesson && (
          <div className="mt-5 rounded-lg bg-[#FBF3E6] p-4">
            <h3 className="font-semibold">{selectedLesson.title}</h3>
            <p className="mt-1 text-xs text-[#6B5344]">
              {selectedLesson.segments?.length ?? 0} segment(s)
            </p>

            {!selectedLesson.published && (
              <form onSubmit={createSegment} className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Segment title
                  </label>
                  <input
                    className={inputClass}
                    value={segmentTitle}
                    onChange={(event) => setSegmentTitle(event.target.value)}
                    placeholder="e.g. What is photosynthesis?"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Start time (seconds)
                    </label>
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="1"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      End time (seconds)
                    </label>
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      step="1"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Quiz passing score (%)
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    max="100"
                    value={passingScore}
                    onChange={(event) => setPassingScore(event.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Segment learning content
                  </label>
                  <textarea
                    className={inputClass}
                    rows={6}
                    value={learningContent}
                    onChange={(event) => setLearningContent(event.target.value)}
                    placeholder="Write the actual concepts, explanations, definitions, examples, and facts covered in this video segment. The AI quiz will use this content."
                    required
                  />
                </div>

                <button className={buttonClass} disabled={saving}>
                  {saving ? 'Adding...' : 'Add segment'}
                </button>
              </form>
            )}

            {selectedLesson.published && (
              <p className="mt-3 text-sm text-[#6B5344]">
                This lesson is published. You can still update existing segment
                learning content below, but cannot add new segments.
              </p>
            )}

            <div className="mt-5 space-y-3">
              <h4 className="font-semibold">Lesson segments</h4>

              {!selectedLesson.segments?.length && (
                <p className="text-sm text-[#6B5344]">
                  No segments yet. Add the first segment above.
                </p>
              )}

              {selectedLesson.segments?.map((segment: VideoSegment) => (
                <article
                  key={segment.id}
                  className="rounded-lg border border-[#EAD5BC] bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h5 className="font-medium">
                        {segment.segmentOrder}. {segment.title}
                      </h5>
                      <p className="text-xs text-[#6B5344]">
                        {formatTime(segment.startTime)} – {formatTime(segment.endTime)}
                        {' · '}
                        Passing score: {segment.passingScore}%
                      </p>
                    </div>

                    <button
                      type="button"
                      className={secondaryButtonClass}
                      onClick={() => {
                        setEditingSegmentId(segment.id);
                        setEditingContent(segment.learningContent ?? '');
                      }}
                    >
                      Edit learning content
                    </button>
                  </div>

                  {editingSegmentId === segment.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        className={inputClass}
                        rows={6}
                        value={editingContent}
                        onChange={(event) => setEditingContent(event.target.value)}
                        placeholder="Enter the actual learning content for this segment..."
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={buttonClass}
                          disabled={saving}
                          onClick={() => void saveSegmentContent(segment.id)}
                        >
                          Save content
                        </button>
                        <button
                          type="button"
                          className={secondaryButtonClass}
                          onClick={() => {
                            setEditingSegmentId('');
                            setEditingContent('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-[#6B5344]">
                      {segment.learningContent?.trim()
                        ? segment.learningContent
                        : 'No learning content provided yet.'}
                    </p>
                  )}
                </article>
              ))}
            </div>

            {!selectedLesson.published && (
              <div className="mt-5 border-t border-[#EAD5BC] pt-4">
                <button
                  type="button"
                  className={buttonClass}
                  disabled={saving || !selectedLesson.segments?.length}
                  onClick={() => void publishLesson(selectedLesson)}
                >
                  Publish lesson
                </button>
                <p className="mt-2 text-xs text-[#6B5344]">
                  Publishing makes this lesson available to students.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">3. Your video lessons</h2>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => void loadData()}
          >
            Refresh
          </button>
        </div>

        {lessons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D8C4AE] bg-white p-6 text-center text-sm text-[#6B5344]">
            No lessons created yet.
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-xl border border-[#EAD5BC] bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <p className="mt-1 text-sm text-[#6B5344]">
                      {lesson.topic?.name ?? 'Curriculum topic'}
                    </p>
                    <p className="mt-1 text-xs text-[#6B5344]">
                      {lesson.segments?.length ?? 0} segment(s)
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      lesson.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {lesson.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <button
                  type="button"
                  className={`${secondaryButtonClass} mt-3`}
                  onClick={() => setSelectedLessonId(lesson.id)}
                >
                  Manage segments
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherVideoLessonsPage;

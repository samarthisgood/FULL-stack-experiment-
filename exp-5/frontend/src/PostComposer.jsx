import React, { useState } from 'react';

const WORD_LIMITS = {
  Twitter: 50,
  Instagram: 100,
  Facebook: 200
};

const PostComposer = ({ onPostCreate, onPostSchedule, onError }) => {
  const [platform, setPlatform] = useState('Twitter');
  const [content, setContent] = useState('');
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    const words = countWords(text);
    const limit = WORD_LIMITS[platform];

    if (words > limit) {
      onError(`Word limit reached for ${platform}! Maximum allowed is ${limit} words.`);
      const truncatedText = text.trim().split(/\s+/).slice(0, limit).join(' ');
      setContent(truncatedText + (text.endsWith(' ') ? ' ' : ''));
    } else {
      onError(null);
      setContent(text);
    }
  };

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
    setContent('');
    onError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (scheduleMode) {
      if (!scheduledAt) {
        onError('Please pick a future date and time to schedule the post.');
        return;
      }
      // datetime-local is "YYYY-MM-DDTHH:mm" — append seconds for LocalDateTime
      const iso = scheduledAt.length === 16 ? `${scheduledAt}:00` : scheduledAt;
      onPostSchedule({ platform, content, scheduledAt: iso });
      setScheduledAt('');
    } else {
      onPostCreate({ platform, content });
    }
    setContent('');
  };

  return (
    <div className="composer-card">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Platform</label>
          <select value={platform} onChange={handlePlatformChange}>
            <option value="Twitter">Twitter (50 words)</option>
            <option value="Instagram">Instagram (100 words)</option>
            <option value="Facebook">Facebook (200 words)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Post Content</label>
          <textarea 
            rows="5"
            placeholder="What's on your mind?"
            value={content}
            onChange={handleContentChange}
          />
          <div className="word-count">
            Words: {countWords(content)} / {WORD_LIMITS[platform]}
          </div>
        </div>

        <div className="form-group schedule-toggle">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={scheduleMode}
              onChange={(e) => setScheduleMode(e.target.checked)}
            />
            Schedule for later
          </label>
        </div>

        {scheduleMode && (
          <div className="form-group">
            <label>Schedule At</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}

        <button type="submit" className="primary-btn">
          {scheduleMode ? 'Schedule Post' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default PostComposer;

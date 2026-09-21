import { useState, useEffect } from 'react'
import PostComposer from './PostComposer'
import PostList from './PostList'
import GlobalError from './GlobalError'
import './App.css'

const API_URL = '/api/posts';

async function parseApiResponse(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message || `Request failed (${response.status})`;
    const details = body?.data;
    const detailText = details && typeof details === 'object'
      ? Object.values(details).join(', ')
      : '';
    throw new Error(detailText ? `${message}: ${detailText}` : message);
  }
  return body?.data;
}

function App() {
  const [posts, setPosts] = useState([]);
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await parseApiResponse(response);
      setPosts(Array.isArray(data) ? data : []);
      setGlobalError(null);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setGlobalError(err.message.includes('fetch')
        ? "Could not connect to backend server. Make sure Spring Boot is running on port 8080."
        : err.message);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      await parseApiResponse(response);
      await fetchPosts();
    } catch (err) {
      setGlobalError(err.message || "Failed to create post.");
    }
  };

  const handleSchedulePost = async (postData) => {
    try {
      const response = await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      await parseApiResponse(response);
      await fetchPosts();
    } catch (err) {
      setGlobalError(err.message || "Failed to schedule post.");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      await parseApiResponse(response);
      await fetchPosts();
    } catch (err) {
      setGlobalError(err.message || "Failed to delete post.");
    }
  };

  const handleUpdatePost = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      await parseApiResponse(response);
      await fetchPosts();
    } catch (err) {
      setGlobalError(err.message || "Failed to update post.");
    }
  };

  return (
    <div className="app-container">
      <GlobalError message={globalError} onClose={() => setGlobalError(null)} />
      
      <header className="app-header">
        <h1>OmniPost Composer</h1>
        <p>Write once, publish anywhere. Respects platform word limits.</p>
      </header>
      
      <main className="app-main">
        <PostComposer 
          onPostCreate={handleCreatePost}
          onPostSchedule={handleSchedulePost}
          onError={setGlobalError} 
        />
        <PostList 
          posts={posts} 
          onDelete={handleDeletePost} 
          onUpdate={handleUpdatePost} 
        />
      </main>
    </div>
  )
}

export default App;

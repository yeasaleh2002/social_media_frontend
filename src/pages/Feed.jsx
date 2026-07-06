import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import RightSidebar from '../components/layout/RightSidebar';
import MobileNav from '../components/layout/MobileNav';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import StorySlider from '../components/feed/StorySlider';
import { api } from '../utils/api';

const PostCardSkeleton = () => (
  <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'pulse-feed-skel 1.5s infinite' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ width: '120px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-feed-skel 1.5s infinite' }} />
        <div style={{ width: '60px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-feed-skel 1.5s infinite' }} />
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ width: '100%', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-feed-skel 1.5s infinite' }} />
      <div style={{ width: '90%', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-feed-skel 1.5s infinite' }} />
    </div>
    <div style={{ width: '100%', height: '220px', backgroundColor: '#e2e8f0', borderRadius: '8px', animation: 'pulse-feed-skel 1.5s infinite' }} />
    <style>{`
      @keyframes pulse-feed-skel {
        0%, 100% { opacity: 1; }
        50% { opacity: .4; }
      }
    `}</style>
  </div>
);

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const endpoint = cursor ? `/feed?limit=10&cursor=${cursor}` : `/feed?limit=10`;
      const res = await api.get(endpoint);
      
      const fetchedPosts = res.data?.posts || [];

      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => {
          const newIds = new Set(fetchedPosts.map(p => p.id));
          return [...prev.filter(p => !newIds.has(p.id)), ...fetchedPosts];
        });
        if (res.data?.nextCursor) {
          setCursor(res.data.nextCursor);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      // Fallback to empty if API fails initially, rather than breaking the UI
      if (!cursor) setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading, hasMore]);

  // Intersection Observer for Infinite Scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchPosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchPosts, hasMore, isLoading]);

  // Initial load
  useEffect(() => {
    if (!cursor && posts.length === 0 && hasMore) {
      fetchPosts();
    }
  }, [fetchPosts, cursor, posts.length, hasMore]);

  const handlePostCreated = (newPost) => {
    // Optimistic UI: instantly unshift the new post to the top of the feed
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <>
      <Navbar />

      <div className="container _custom_container">
        <div className="_layout_inner_wrap">
          <div className="row">
            <Sidebar />

            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <div className="_layout_middle_wrap">
                {/* For Desktop */}
                <StorySlider />

                <CreatePost onPostCreated={handlePostCreated} />

                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}

                {!isLoading && posts.length === 0 && (
                  <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '40px 20px', textAlign: 'center', margin: '20px 0' }}>
                    <p style={{ color: '#888', fontSize: '16px', fontWeight: '500', margin: 0 }}>No post is available there</p>
                  </div>
                )}

                {posts.length === 0 && isLoading && (
                  <>
                    <PostCardSkeleton />
                    <PostCardSkeleton />
                  </>
                )}

                <div ref={observerTarget} style={{ padding: '24px 0' }}>
                  {posts.length > 0 && isLoading && (
                    <PostCardSkeleton />
                  )}
                  {!hasMore && posts.length > 0 && (
                    <p style={{ color: '#888', fontWeight: '500', fontSize: '14px', textAlign: 'center', margin: 0 }}>You've caught up! No more posts to show.</p>
                  )}
                </div>
              </div>
            </div>

            <RightSidebar />
          </div>
        </div>
      </div>

      <MobileNav />
    </>
  );
}

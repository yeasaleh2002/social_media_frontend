import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';
import { api } from '../../utils/api';

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(post.hasLiked || false);
  const [likesCount, setLikesCount] = useState(post.likeCount ?? post.likes ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [showLikesModal, setShowLikesModal] = useState(false);

  const fetchLikes = async () => {
    try {
      const res = await api.get(`/posts/${post.id}/likes`);
      if (res.success && res.data?.users) {
        setLikedUsers(res.data.users);
      }
    } catch (e) {
      console.error("Failed to fetch post likes:", e);
    }
  };

  const handleMouseEnter = () => {
    fetchLikes();
  };

  const handleLikesClick = () => {
    fetchLikes();
    setShowLikesModal(true);
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;
    
    setIsLiked(!isLiked);
    setLikesCount(prev => !isLiked ? prev + 1 : prev - 1);
    setIsLiking(true);

    try {
      const res = await api.post('/likes/toggle', { postId: post.id });
      if (!res.success) {
        throw new Error(res.error || 'Failed to toggle like');
      }
    } catch (error) {
      console.error("Failed to toggle like. Rolling back UI.");
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <Link to={`/profile/${post.author?.id || '0'}`}>
                <img src={post.author?.image || '/src/assets/images/post_img.png'} alt="Image" className="_post_img" />
              </Link>
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                <Link to={`/profile/${post.author?.id || '0'}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {post.author?.name || (post.author ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() : 'Unknown User')}
                </Link>
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} . <a href="#0">Public</a>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button type="button" id="_timeline_show_drop_btn" className="_feed_timeline_post_dropdown_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <h4 className="_feed_inner_timeline_post_title" style={{ whiteSpace: 'pre-wrap', fontWeight: 'normal', fontSize: '15px' }}>{post.content}</h4>
        {(post.imageUrl || post.image) && (
          <div className="_feed_inner_timeline_image">
            <img src={post.imageUrl || post.image} alt="Image" className="_time_img" />
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <img src="/src/assets/images/react_img1.png" alt="Image" className="_react_img1" />
          <img src="/src/assets/images/react_img2.png" alt="Image" className="_react_img" />
          <p 
            className="_feed_inner_timeline_total_reacts_para"
            style={{ cursor: 'pointer' }}
            onMouseEnter={handleMouseEnter}
            onClick={handleLikesClick}
            title={likedUsers.length > 0 ? likedUsers.map(u => `${u.firstName || ''} ${u.lastName || ''}`.trim()).join(', ') : 'No likes yet'}
          >
            {likesCount}
          </p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <a href="#0" onClick={(e) => { e.preventDefault(); setShowComments(!showComments); }}>
              <span>{post.commentCount ?? post.comments ?? 0}</span> Comment
            </a>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>0</span> Share</p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button 
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${isLiked ? '_feed_reaction_active' : ''}`}
          onClick={handleLike}
        >
          <span className="_feed_inner_timeline_reaction_link"> 
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/>
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/>
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/>
              </svg>
              {isLiked ? 'Haha' : 'React'}
            </span>
          </span>
        </button>
        <button 
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="_feed_inner_timeline_reaction_link"> 
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"/>
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563"/>
              </svg>                                                      
              Comment
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link"> 
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"/>
              </svg>                                                 
              Share
            </span>
          </span>
        </button>
      </div>

      <CommentSection 
        postId={post.id} 
        initialComments={post.comments || []} 
        showCommentsList={showComments} 
        onCommentsToggled={setShowComments}
      />

      {showLikesModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowLikesModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'var(--bg1, #ffffff)',
              color: 'var(--color6, #112032)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '400px',
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color, #eee)'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Liked By</h4>
              <button 
                type="button" 
                onClick={() => setShowLikesModal(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#888',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
              {likedUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No likes yet
                </div>
              ) : (
                likedUsers.map(user => (
                  <div 
                    key={user.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-color, #f5f5f5)'
                    }}
                  >
                    <img 
                      src={user.image || '/src/assets/images/profile.png'} 
                      alt="" 
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #ddd'
                      }}
                    />
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>
                      {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

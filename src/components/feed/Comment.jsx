import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../../utils/api';
import { toast } from 'react-toastify';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  } catch {
    return 'Just now';
  }
};

export default function Comment({ comment, postId, depth = 0, onReplyAdded }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(comment.hasLiked || comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likeCount ?? comment.likes ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);

  const fetchLikes = async () => {
    try {
      const res = await api.get(`/comments/${comment.id}/likes`);
      if (res.success && res.data?.users) {
        setLikedUsers(res.data.users);
      }
    } catch (e) {
      console.error("Failed to fetch comment likes:", e);
    }
  };

  const handleMouseEnter = () => {
    fetchLikes();
  };

  const handleLike = async () => {
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(prev => !isLiked ? prev + 1 : prev - 1);
    
    try {
      const res = await api.post('/likes/toggle', { commentId: comment.id });
      if (!res.success) {
        throw new Error(res.error || 'Failed to toggle like');
      }
    } catch (error) {
      console.error("Failed to toggle comment like:", error);
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    }
  };

  const getLoggedInUser = () => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content: replyText.trim(),
        parentId: comment.id
      });

      if (res.success && res.data?.comment) {
        if (onReplyAdded) {
          onReplyAdded({
            ...res.data.comment,
            author: getLoggedInUser(),
            likeCount: 0,
            hasLiked: false,
            replies: []
          });
        }
        setReplyText('');
        setIsReplying(false);
        toast.success('Reply posted!');
      } else {
        throw new Error(res.error || 'Failed to post reply');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to post reply');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="_comment_main" style={{ marginLeft: depth > 0 ? '12px' : '0px', marginTop: '8px', position: 'relative' }}>
      {depth > 0 && (
        <div style={{
          position: 'absolute',
          left: '-8px',
          top: '-12px',
          width: '12px',
          height: '26px',
          borderLeft: '2px solid #e2e8f0',
          borderBottom: '2px solid #e2e8f0',
          borderBottomLeftRadius: '6px'
        }} />
      )}
      <div className="_comment_image">
        <Link to={`/profile/${comment.author?.id || '0'}`} className="_comment_image_link">
          <img 
            src={comment.author?.image || '/src/assets/images/profile.png'} 
            alt="" 
            className="_comment_img1" 
          />
        </Link>
      </div>
      <div className="_comment_area" style={{ flex: 1 }}>
        <div className="_comment_details" style={{ minWidth: '180px', padding: '6px 12px' }}>
          {depth > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', fontSize: '11px', color: '#888', fontWeight: '500' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'rotate(180deg)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>
                {comment.parentNode?.author 
                  ? `Replying to ${comment.parentNode.author.firstName || ''} ${comment.parentNode.author.lastName || ''}`.trim()
                  : 'Reply'}
              </span>
            </div>
          )}
          <div className="_comment_details_top">
            <div className="_comment_name">
              <Link to={`/profile/${comment.author?.id || '0'}`}>
                <h4 className="_comment_name_title">
                  {comment.author?.name || (comment.author ? `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim() : 'User')}
                </h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content || comment.text}</span>
            </p>
          </div>
          
          {likesCount > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like" style={{ cursor: 'pointer' }} onClick={handleLike}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </span>
              </div>
              <span 
                className="_total"
                style={{ cursor: 'help' }}
                onMouseEnter={handleMouseEnter}
                title={likedUsers.length > 0 ? likedUsers.map(u => `${u.firstName || ''} ${u.lastName || ''}`.trim()).join(', ') : 'No likes yet'}
              >
                {likesCount}
              </span>
            </div>
          )}

          <div className="_comment_reply">
            <div className="_comment_reply_num" style={{ whiteSpace: 'nowrap' }}>
              <ul className="_comment_reply_list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                  <span 
                    onClick={handleLike} 
                    style={{ cursor: 'pointer', fontWeight: isLiked ? 'bold' : 'normal', color: isLiked ? '#377DFF' : 'inherit' }}
                  >
                    Like.
                  </span>
                </li>
                <li>
                  <span onClick={() => setIsReplying(!isReplying)} style={{ cursor: 'pointer', color: isReplying ? '#377DFF' : 'inherit' }}>
                    Reply.
                  </span>
                </li>
                <li><span>Share</span></li>
                <li><span className="_time_link">.{formatTimeAgo(comment.createdAt)}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reply Input Box */}
        {isReplying && (
          <div className="_feed_inner_comment_box" style={{ marginTop: '12px', marginLeft: '0px' }}>
            <form className="_feed_inner_comment_box_form" onSubmit={handleReplySubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src="/src/assets/images/comment_img.png" alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea 
                    className="form-control _comment_textarea" 
                    placeholder="Write a reply..." 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReplySubmit(e);
                      }
                    }}
                  ></textarea>
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button 
                  type="submit" 
                  className="_feed_inner_comment_box_icon_btn" 
                  disabled={isLoading || !replyText.trim()}
                  style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm-2.846-3.717L8.14 8.71 13.424 1.87 3.79 6.353Z"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import Comment from './Comment';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';

function buildCommentTree(flatComments) {
  if (!Array.isArray(flatComments)) return [];
  const map = {};
  const roots = [];

  flatComments.forEach(item => {
    map[item.id] = { ...item, replies: item.replies ? [...item.replies] : [] };
  });

  flatComments.forEach(item => {
    const mapped = map[item.id];
    if (item.parentId && map[item.parentId]) {
      const parent = map[item.parentId];
      if (!parent.replies.some(r => r.id === mapped.id)) {
        parent.replies.push(mapped);
      }
    } else {
      roots.push(mapped);
    }
  });

  return roots;
}

function flattenCommentTree(treeNodes) {
  const result = [];
  function traverse(node, depth = 0, parentNode = null) {
    result.push({ ...node, depth, parentNode });
    if (node.replies && node.replies.length > 0) {
      node.replies.forEach(reply => traverse(reply, depth + 1, node));
    }
  }
  treeNodes.forEach(rootNode => traverse(rootNode, 0, null));
  return result;
}

export default function CommentSection({ postId, _initialComments = [], showCommentsList = false, onCommentsToggled }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchComments = useCallback(async (isLoadMore = false) => {
    try {
      const endpoint = isLoadMore && cursor 
        ? `/posts/${postId}/comments?cursor=${cursor}` 
        : `/posts/${postId}/comments?limit=6`;
      const res = await api.get(endpoint);
      if (res.success && res.data) {
        const fetchedComments = res.data.comments || [];
        const next = res.data.nextCursor;
        setComments(prev => {
          const merged = isLoadMore 
            ? [...prev, ...fetchedComments] 
            : fetchedComments;
          return buildCommentTree(merged);
        });
        setCursor(next);
        setHasMore(!!next);
      }
    } catch (e) {
      console.error("Failed to load comments:", e);
    }
  }, [postId, cursor]);

  useEffect(() => {
    if (showCommentsList && !hasFetched) {
      setHasFetched(true);
      fetchComments(false);
    }
  }, [showCommentsList, hasFetched, fetchComments]);

  const handleReplyAdded = (newReply) => {
    const insertReply = (list) => {
      return list.map(c => {
        if (c.id === newReply.parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply]
          };
        } else if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: insertReply(c.replies)
          };
        }
        return c;
      });
    };
    setComments(prev => insertReply(prev));
  };

  const getLoggedInUser = () => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, { content: commentText.trim() });
      if (res.success && res.data?.comment) {
        const newComment = {
          ...res.data.comment,
          author: getLoggedInUser(),
          likeCount: 0,
          hasLiked: false,
          replies: []
        };
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
        toast.success('Comment added successfully!');
        if (onCommentsToggled) {
          onCommentsToggled(true);
        }
      } else {
        throw new Error(res.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form onSubmit={handleSubmit} className="_feed_inner_comment_box_form">
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <img src="/src/assets/images/comment_img.png" alt="" className="_comment_img" />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea 
                  className="form-control _comment_textarea" 
                  placeholder="Write a comment" 
                  id="floatingTextarea2"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                ></textarea>
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              <button 
                type="submit" 
                className="_feed_inner_comment_box_icon_btn"
                disabled={isLoading || !commentText.trim()}
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
      </div>

      {showCommentsList && (
        <div className="_timline_comment_main">
          {hasMore && (
            <div className="_previous_comment" style={{ marginBottom: '16px' }}>
              <button type="button" className="_previous_comment_txt" onClick={() => fetchComments(true)}>
                View previous comments
              </button>
            </div>
          )}

          <div className="_comments_list">
            {flattenCommentTree(comments).map(comment => (
              <Comment 
                key={comment.id} 
                comment={comment} 
                postId={postId}
                depth={comment.depth}
                onReplyAdded={handleReplyAdded}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

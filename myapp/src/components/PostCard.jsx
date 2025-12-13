import { useState } from "react";
import axios from "../utils/instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post, refreshPosts }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const isLiked = post.likes?.some((id) => id.toString() === user?._id);

  const handleLike = async () => {
    if (!user) return toast.error("Please login first");
    try {
      setLikeLoading(true);
      await axios.post(`/posts/${post.slug}/${isLiked ? "unlike" : "like"}`);
      refreshPosts();
    } catch {
      toast.error("Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDoubleClick = () => {
    if (!isLiked) handleLike();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      setCommentLoading(true);
      await axios.post(`/posts/${post.slug}/comment`, { text: comment });
      setComment("");
      refreshPosts();
      setShowComments(true);
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/posts/${post.slug}/comment/${commentId}`);
      refreshPosts();
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const likeText = () => {
    if (post.likes.length === 0) return null;
    if (post.likes.length === 1) return "1 like";
    return `Liked by ${post.author?.username} and ${post.likes.length - 1} others`;
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm mb-6">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/profile/${post.author?.username}`)}
        >
          <img
            src={post.author?.profilePic || "/default-avatar.png"}
            alt={post.author?.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <h2 className="font-semibold">{post.author?.username}</h2>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* IMAGE */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          onDoubleClick={handleDoubleClick}
          onClick={() => navigate(`/post/${post.slug}`)}
          className="w-full max-h-[420px] object-cover cursor-pointer"
        />
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-5 px-4 py-2 text-lg">
        <button onClick={handleLike} disabled={likeLoading}>
          {isLiked ? "❤️" : "🤍"}
        </button>
        <button onClick={() => setShowComments(!showComments)}>💬</button>
      </div>

      {/* LIKE TEXT */}
      {likeText() && <p className="px-4 text-sm font-semibold">{likeText()}</p>}

      {/* CAPTION */}
      <p className="px-4 text-sm mt-1">
        <span
          className="font-semibold mr-1 cursor-pointer"
          onClick={() => navigate(`/profile/${post.author?.username}`)}
        >
          {post.author?.username}
        </span>
        {post.content}
      </p>

      {/* VIEW COMMENTS */}
      {post.comments?.length > 0 && !showComments && (
        <p
          onClick={() => setShowComments(true)}
          className="px-4 text-sm text-gray-500 cursor-pointer mt-1"
        >
          View all {post.comments.length} comments
        </p>
      )}

      {/* COMMENTS */}
      {showComments && (
        <div className="px-4 mt-2 space-y-2 max-h-40 overflow-y-auto">
          {post.comments.map((c) => (
            <div key={c._id} className="flex items-start justify-between text-sm gap-2">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(`/profile/${c.user?.username}`)}
              >
                <img
                  src={c.user?.profilePic || "/default-avatar.png"}
                  alt={c.user?.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <p>
                  <span className="font-semibold">{c.user?.username}</span> {c.text}
                </p>
              </div>
              {user?._id === c.user?._id && (
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-500 text-xs"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ADD COMMENT */}
      {user && (
        <div className="flex items-center border-t mt-3 px-3 py-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 outline-none text-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
          />
          <button
            onClick={handleComment}
            disabled={commentLoading}
            className="text-blue-600 font-semibold text-sm"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}

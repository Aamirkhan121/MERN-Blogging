import { useState } from "react";
import axios from "../utils/instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PostCard({ post, refreshPosts }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);

  const isLiked = post.likes?.some((id) => id.toString() === user?._id);

  const handleLike = async () => {
    if (!user) return toast.error("Please login first");
    try {
      setLikeLoading(true);
      await axios.post(`/posts/${post.slug}/${isLiked ? "unlike" : "like"}`);
      refreshPosts();
      setAnimateLike(true); // trigger heart animation
      setTimeout(() => setAnimateLike(false), 500);
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
      className="bg-white border rounded-xl shadow-sm mb-6"
    >
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
        <motion.img
          src={post.image}
          alt={post.title}
          onDoubleClick={handleDoubleClick}
          onClick={() => navigate(`/post/${post.slug}`)}
          className="w-full max-h-[420px] object-cover cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-5 px-4 py-2 text-lg">
        <motion.button
          onClick={handleLike}
          disabled={likeLoading}
          whileTap={{ scale: 1.3 }}
          className="relative"
        >
          {isLiked ? "❤️" : "🤍"}
          {animateLike && (
            <motion.span
              key="like-animation"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute left-0 top-0 text-red-500 text-xl"
            >
              ❤️
            </motion.span>
          )}
        </motion.button>
        <button onClick={() => setShowComments(!showComments)}>💬</button>
      </div>

      {/* LIKE TEXT */}
      {likeText() && (
        <motion.p
          className="px-4 text-sm font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {likeText()}
        </motion.p>
      )}

      {/* CAPTION */}
      <motion.p
        className="px-4 text-sm mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span
          className="font-semibold mr-1 cursor-pointer"
          onClick={() => navigate(`/profile/${post.author?.username}`)}
        >
          {post.author?.username}
        </span>
        {post.content}
      </motion.p>

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
      <AnimatePresence>
        {showComments && (
          <motion.div
            className="px-4 mt-2 space-y-2 max-h-40 overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {post.comments.map((c) => (
              <motion.div
                key={c._id}
                className="flex items-start justify-between text-sm gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
              >
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
                    <span className="font-semibold">{c.user?.username}</span>{" "}
                    {c.text}
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
          <motion.button
            onClick={handleComment}
            disabled={commentLoading}
            whileTap={{ scale: 1.2 }}
            className="text-blue-600 font-semibold text-sm"
          >
            Post
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

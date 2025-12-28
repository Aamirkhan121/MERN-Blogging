import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/instance";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function SinglePost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/posts/${slug}`);
      setPost(res.data);
      setTitle(res.data.title);
      setCaption(res.data.caption);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  const isAuthor = user?._id === post.author?._id;
  const isLiked = post.likes?.some((id) => id.toString() === user?._id);

  /* ---------------- LIKE / UNLIKE ---------------- */
  const handleLike = async () => {
    if (!user) return toast.error("Please login first");

    try {
      setLikeLoading(true);
      await axios.post(`/posts/${post.slug}/${isLiked ? "unlike" : "like"}`);
      fetchPost();
    } catch {
      toast.error("Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  /* ---------------- ADD COMMENT ---------------- */
  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      setCommentLoading(true);
      await axios.post(
        `/posts/${post.slug}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setComment("");
      fetchPost();
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  /* ---------------- DELETE COMMENT ---------------- */
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/posts/${post.slug}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchPost();
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  /* ---------------- UPDATE POST ---------------- */
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `/posts/update/${post.slug}`,
        { title, caption },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Post updated");
      setEditMode(false);
      navigate(`/post/${res.data.post.slug}`);
    } catch {
      toast.error("Failed to update post");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 mb-20">
      {/* IMAGE */}
      {post.image && <img src={post.image} alt={post.title} className="w-full rounded-xl mb-6" />}

      {/* TITLE */}
      {editMode ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold border p-2 rounded mb-2"
        />
      ) : (
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      )}

      <p className="text-gray-500 text-sm mb-4">By {post.author?.username}</p>

      {/* CAPTION */}
      {editMode ? (
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          rows={4}
        />
      ) : (
        <p className="text-lg text-gray-800 mb-4">{post.caption}</p>
      )}

      {/* EDIT BUTTON */}
      {isAuthor && (
        <div className="mb-4">
          {editMode ? (
            <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-1 rounded mr-2">
              Save
            </button>
          ) : (
            <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-1 rounded">
              Edit Post
            </button>
          )}
        </div>
      )}

      {/* LIKE */}
    <motion.button
  onClick={handleLike}
  disabled={likeLoading}
  whileTap={{ scale: 1.3 }}
  className="mb-4 text-2xl"
>
  <motion.span
    key={isLiked ? "liked" : "unliked"} // re-render animation
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
  </motion.span>
</motion.button>

      {/* COMMENTS */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Comments ({post.comments?.length || 0})</h3>

        <AnimatePresence>
          {post.comments?.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
              className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded mb-1"
            >
              <p>
                <span className="font-semibold">{c.user?.username}:</span> {c.text}
              </p>

              {user?._id === c.user?._id && (
                <motion.button
                  onClick={() => handleDeleteComment(c._id)}
                  whileTap={{ scale: 1.2 }}
                  className="text-red-500 text-xs"
                >
                  Delete
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ADD COMMENT */}
      {user && (
        <div className="flex mt-3">
          <input
            type="text"
            className="flex-1 border p-2 rounded-l"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
          />
          <motion.button
            onClick={handleComment}
            disabled={commentLoading}
            whileTap={{ scale: 1.1 }}
            className="bg-blue-600 text-white px-4 rounded-r"
          >
            {commentLoading ? "..." : "Post"}
          </motion.button>
        </div>
      )}
    </div>
  );
}

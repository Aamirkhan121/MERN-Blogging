import { useEffect, useState } from "react";
import axios from "../utils/instance";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import { motion } from "framer-motion";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/posts/all");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        All Posts
      </motion.h1>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array(6) // number of skeletons to show
            .fill(0)
            .map((_, i) => (
              <PostSkeleton key={i} />
            ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet.</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="grid md:grid-cols-2 gap-6"
        >
          {posts.map((post) => (
            <motion.div
              key={post._id}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            >
              <PostCard post={post} refreshPosts={fetchPosts} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

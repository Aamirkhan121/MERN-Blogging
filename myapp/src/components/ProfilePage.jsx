import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/instance";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/profile/${username}`);
        setUser(res.data.user);
        console.log(res.data.user)
      } catch (err) {
        toast.error(err.response?.data?.message || "User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!user) return <p className="text-center mt-20">User not found</p>;

  const isOwnProfile = loggedUser?._id === user._id;

  const isFollowing = user.followers?.some(
    (f) => f._id === loggedUser?._id
  );

  // 🔹 Follow
  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      const res = await axios.put(`/users/follow/${username}`);
      setUser(res.data.user);
      toast.success("Followed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Follow failed");
    } finally {
      setFollowLoading(false);
    }
  };

  // 🔹 Unfollow
  const handleUnfollow = async () => {
    try {
      setFollowLoading(true);
      const res = await axios.put(`/users/unfollow/${username}`);
      setUser(res.data.user);
      toast.success("Unfollowed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unfollow failed");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* PROFILE HEADER */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white shadow rounded-xl p-6 mb-8">
        <div className="relative">
          <img
            src={user.profilePic || "/default-profile.png"}
            alt={user.username}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-green-500 shadow-lg"
          />
        </div>

        <div className="flex-1 flex flex-col md:justify-center gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">{user.username}</h1>

          
            {/* 🔥 FOLLOW / UNFOLLOW */}
            {loggedUser && !isOwnProfile && (
              <button
                disabled={followLoading}
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className={`px-5 py-2 rounded-md text-white font-medium ${
                  isFollowing
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {followLoading
                  ? "Please wait..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}

            {isOwnProfile && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => navigate("/profile")}
              >
                Edit Profile
              </button>
            )}
          </div>
          <p className="text-gray-600">{user.email}</p>

          {/* FOLLOW INFO - optional */}
          <div className="flex gap-4 mt-2 text-sm text-gray-700">
            <span>
              <strong>{user.followers?.length || 0}</strong> Followers
            </span>
            <span>
              <strong>{user.following?.length || 0}</strong> Following
            </span>
            <span>
              <strong>{user.posts?.length || 0}</strong> Posts
            </span>
          </div>
        </div>
      </div>

      {/* ================= POSTS GRID ================= */}
      {user.posts?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {user.posts.map((post) => (
            <div
              key={post._id}
              className="relative group cursor-pointer"
              onClick={() => navigate(`/post/${post.slug}`)}
            >
              <img
                src={post.image}
                alt={post.caption || post.title}
                className="w-full h-48 md:h-56 object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white rounded-lg transition-opacity">
                <p className="text-sm">{post.caption}</p>
                <p className="mt-2 text-xs">
                  ❤️ {post.likes?.length || 0} &nbsp; 💬 {post.comments?.length || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts yet</p>
      )}
    </div>
  );
}

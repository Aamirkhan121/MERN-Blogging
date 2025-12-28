import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
      } catch (err) {
        toast.error(err.response?.data?.message || "User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!user) return <p className="text-center mt-20 text-gray-500">User not found</p>;

  const isOwnProfile = loggedUser?._id === user._id;
  const isFollowing = user.followers?.some(f => f._id === loggedUser?._id);

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
    <div className="max-w-6xl mx-auto p-4 mb-20">
      {/* ================= PROFILE HEADER ================= */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white shadow-2xl rounded-2xl p-8 mb-10 transition-all hover:shadow-xl">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={user.profilePic || "/default-profile.png"}
            alt={user.username}
            className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-green-500 shadow-lg transition-transform hover:scale-105"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col md:justify-center gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
              {user.username}
            </h1>

            {loggedUser && !isOwnProfile && (
              <div className="flex gap-3 flex-wrap">
                <button
                  disabled={followLoading}
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className={`px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
                    isFollowing
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                  }`}
                >
                  {followLoading
                    ? "Please wait..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>

                <button
                  onClick={() => navigate(`/chat/${user.username}`)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Message
                </button>
              </div>
            )}

            {isOwnProfile && (
              <button
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => navigate("/profile")}
              >
                Edit Profile
              </button>
            )}
          </div>

          <p className="text-gray-600 text-sm md:text-base">{user.email}</p>

          {/* Stats */}
          <div className="flex gap-6 mt-4 text-gray-700 text-sm md:text-base font-medium">
            <span>
              <strong className="text-gray-800">{user.followers?.length || 0}</strong> Followers
            </span>
            <span>
              <strong className="text-gray-800">{user.following?.length || 0}</strong> Following
            </span>
            <span>
              <strong className="text-gray-800">{user.posts?.length || 0}</strong> Posts
            </span>
          </div>
        </div>
      </div>

      {/* ================= POSTS GRID ================= */}
      {user.posts?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user.posts.map(post => (
            <div
              key={post._id}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/post/${post.slug}`)}
            >
              <img
                src={post.image}
                alt={post.caption || post.title}
                className="w-full h-48 md:h-56 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white rounded-xl transition-opacity duration-300 px-2 text-center">
                <p className="text-sm md:text-base truncate">{post.caption}</p>
                <p className="mt-2 text-xs md:text-sm">
                  ❤️ {post.likes?.length || 0} &nbsp; 💬 {post.comments?.length || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">No posts yet</p>
      )}
    </div>
  );
}

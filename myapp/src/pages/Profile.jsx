import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/instance";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // 🔹 Get profile by username
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/users/profile/${username}`);
      setUser(res.data.user);
      console.log(res.data.user)

      setIsFollowing(
        res.data.user.followers.some(
          (f) => f._id === loggedUser._id
        )
      );
    } catch (err) {
      toast.error("Profile not found");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  // 🔹 Follow
  const followUser = async () => {
    try {
      await axios.put(`/users/follow/${username}`);
      toast.success("Followed");
      fetchProfile();
    } catch (err) {
      toast.error("Follow failed");
    }
  };

  // 🔹 Unfollow
  const unfollowUser = async () => {
    try {
      await axios.put(`/users/unfollow/${username}`);
      toast.success("Unfollowed");
      fetchProfile();
    } catch (err) {
      toast.error("Unfollow failed");
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={user.profilePic || "/default-profile.png"}
          className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
        />

        <h2 className="text-xl font-bold">@{user.username}</h2>
        <p className="text-gray-600">{user.email}</p>

        {/* ================= FOLLOW BUTTON ================= */}
        {loggedUser._id !== user._id && (
          <button
            onClick={isFollowing ? unfollowUser : followUser}
            className={`px-6 py-2 rounded-full text-white font-medium ${
              isFollowing
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* ================= STATS ================= */}
      <div className="flex justify-around text-center mt-6">
        <div>
          <p className="font-bold">{user.posts?.length || 0}</p>
          <p className="text-sm text-gray-500">Posts</p>
        </div>
        <div>
          <p className="font-bold">{user.followers.length}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div>
          <p className="font-bold">{user.following.length}</p>
          <p className="text-sm text-gray-500">Following</p>
        </div>
      </div>

      {/* ================= FOLLOWERS LIST ================= */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Followers</h3>
        {user.followers.length === 0 && (
          <p className="text-sm text-gray-500">No followers yet</p>
        )}
        {user.followers.map((f) => (
          <div
            key={f._id}
            onClick={() => navigate(`/profile/${f.username}`)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded"
          >
            <img
              src={f.profilePic || "/default-profile.png"}
              className="w-8 h-8 rounded-full"
            />
            <span>{f.username}</span>
          </div>
        ))}
      </div>

      {/* ================= FOLLOWING LIST ================= */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Following</h3>
        {user.following.length === 0 && (
          <p className="text-sm text-gray-500">Not following anyone</p>
        )}
        {user.following.map((f) => (
          <div
            key={f._id}
            onClick={() => navigate(`/profile/${f.username}`)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded"
          >
            <img
              src={f.profilePic || "/default-profile.png"}
              className="w-8 h-8 rounded-full"
            />
            <span>{f.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}




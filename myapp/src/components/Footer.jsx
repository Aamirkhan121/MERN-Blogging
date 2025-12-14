import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO & ABOUT */}
        <div className="flex flex-col gap-4">
  {/* LOGO + BRAND */}
  <div className="flex items-center gap-3">
    <img
      src="/K_T_Logo.png"
      alt="K_T Logo"
      className="w-20 h-20 object-contain bg-white rounded-full p-1"
    />
    <div>
      <h2 className="text-2xl font-extrabold tracking-wide text-green-500">
        MyBlog
      </h2>
      <span className="text-xs text-gray-400 tracking-wider">
        Share • Create • Inspire
      </span>
    </div>
  </div>

  {/* DESCRIPTION */}
  <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
    MyBlog is a modern <span className="text-green-400 font-medium">MERN-based</span> blogging platform where users can
    share posts, images, and ideas with the world in a clean and social way.
  </p>
</div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-green-400">Home</Link></li>
            <li><Link to="/create-post" className="hover:text-green-400">Create Post</Link></li>
            <li><Link to="/profile" className="hover:text-green-400">My Profile</Link></li>
            <li><Link to="/login" className="hover:text-green-400">Login</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-400">Help Center</a></li>
            <li><a href="#" className="hover:text-green-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-green-400">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Follow Us
          </h3>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-green-500 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-green-500 transition">
              <FaInstagram />
            </a>
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-green-500 transition">
              <FaGithub />
            </a>
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-green-500 transition">
              <FaLinkedin />
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 text-center py-4 text-sm">
        © {new Date().getFullYear()} <span className="text-green-500">MyBlog</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


import { FaFacebookF, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 fixed bottom-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto   px-6 py-2 flex justify-between items-center">
        
        {/* LEFT: COPYRIGHT */}
        <div className="text-sm">
          © {new Date().getFullYear()} <span className="text-green-500">MyBlog</span>. All rights reserved.
        </div>

        {/* RIGHT: SOCIAL ICONS */}
        <div className="flex items-center gap-3">
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition">
            <FaFacebookF />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition">
            <FaInstagram />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition">
            <FaGithub />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-500 transition">
            <FaLinkedin />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

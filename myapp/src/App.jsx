import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import ProfilePage from "./components/ProfilePage";


function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:slug" element={<SinglePost />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


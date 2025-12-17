import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import ProfilePage from "./components/ProfilePage";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectRoute";
import Footer from "./components/Footer";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";


function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute> } />
         
        {/* PUBLIC */}
        <Route path="/login" element={<PublicRoute> <Login />  </PublicRoute>}/>
        <Route path="/register" element={<PublicRoute> <Register />  </PublicRoute> } />
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute> } />
        <Route path="/create-post" element={<ProtectedRoute> <CreatePost/>  </ProtectedRoute> } />
        <Route path="/post/:slug" element={<ProtectedRoute> <SinglePost /> </ProtectedRoute> } />
        <Route path="/profile/:username" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute> } />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/chat/:username" element={<Chat />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;


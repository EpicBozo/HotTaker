import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./Header.jsx";
import CreatePost from "./components/post/CreatePost.jsx";
import Feed from "./components/post/feed.jsx";
import Footer from "./Footer.jsx";
import Login from './components/accounts/Login';
import SignUp from './components/accounts/signup';
import VerificationSuccess from './components/accounts/verification_success';
import VerifyEmail from './components/accounts/verify_email';
import VerificationFailed from './components/accounts/verification_failed';
import User_Post from './components/post/user-post';
import Logout from './components/accounts/logout';
import axios from 'axios';
import { UserProvider } from './components/accounts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './components/accounts/profile';

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/feed" element={<Feed />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify/:uid/:token" element={<VerifyEmail />} />
              <Route path="/verification-success" element={<VerificationSuccess />} />
              <Route path="/verification-failed" element={<VerificationFailed />} />
              <Route path="/logout" element= {<Logout />} />
              <Route path="/posts/:postId" element={<User_Post />} />
              <Route path="/:username" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
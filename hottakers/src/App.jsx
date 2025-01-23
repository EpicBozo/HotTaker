import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header.jsx";
import "./css/index.css";
import CreatePost from "./CreatePost.jsx";
import Footer from "./Footer.jsx";
import Login from "./components/accounts/Login.jsx";
import SignUp from "./components/accounts/signup.jsx";
import VerificationSuccess from "./components/accounts/verification_success.jsx";
// import VerifyEmail from './components/accounts/verify_email';
import axios from "axios";
// import { UserProvider } from './components/accounts/UserContext';

// Set base URL for all axios requests
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} /> */}
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify/:uid/:token" element={<VerificationSuccess />} />
            <Route path="/verification-success" element={<VerificationSuccess />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import axios from 'axios';
import Header from './Header.jsx'

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8000'; // or your Django backend URL
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // if using session authentication

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/:uid/:token" element={<VerificationSuccess />} />
      </Routes>
    </Router>
  );
}

export default App

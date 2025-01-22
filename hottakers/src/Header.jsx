import plusMark from "./assets/plusMark.svg";
import { useState, useEffect, createContext } from "react";
import axios from 'axios';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  

  function handleClick() {
    console.log("anything");
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/check');
        setIsAuthenticated(response.data.isAuthenticated);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <header>
      <nav>
        <home>
          <a href="#">Hot Takers</a>
        </home>

        <search>
          <input type="text" placeholder="Search Topics" />
        </search>

        <right-nav>
          <feed>
            <a href="#">Feed</a>
          </feed>
          {isAuthenticated && (
          <div className="post" onClick={handleClick}>
            <img src={plusMark} alt="plus" />
            <p>Post</p>
          </div>
            )} 
          {isAuthenticated ? (
            <profile>
              <img
              src= {`http://localhost:8000${user?.pfp}`}
              alt="profile"
              className="w-10 h-10 rounded-full"> 
              
              </img>
            </profile>
          ) : (
            <login>
              <a 
              href ="/login"
              className = "px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
              >
              Login               
              </a>
            </login>
          )}
        </right-nav>
      </nav>
      <hr></hr>
    </header>
  );
}

export default Header;

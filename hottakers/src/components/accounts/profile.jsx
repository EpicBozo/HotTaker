import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from './UserContext';
import axios from 'axios';


/* TODO: Make url based on the username ie, localhost.com/Tester1
will show the profile for that user */
const Profile = () => {
    const { user } = useUser();
    const [userExists, setUserExists] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [posts, setPosts] = useState([]);
    const [postsExists, setPostsExists] = useState(true);
    const [error, setError] = useState(null);
    const {username} = useParams();
    const isOwnProfile = user?.username === username;

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/${username}/`);
                setPosts(response.data.posts);
                setUserInfo(response.data.account)
                setPostsExists(true);
            } catch (err) {
                // Add proper error handeling for no posts found and for no user founds
                if (err.response?.status === 404) {
                    setError('User not found');
                    setUserExists(false);
                } else {
                    setError('An error occurred while fetching user data');
                }
                console.error('Error:', err.response?.data);
            }
        };
        fetchPosts();
    }, [username]);

   

    return (
        <div>
            {/* Change the state based on the error */}
            {userInfo ? (
                <div>
                    <h1>{userInfo.username}</h1>
                    <p>{userInfo.status}</p>
                    <p>{userInfo.bio}</p>
                    {isOwnProfile && (
                        <div id="authenticated">
                            <p>{userInfo.email}</p>
                            <Link to="/edit">Edit Profile</Link>
                        </div>
                    )}
                    
                    <div className="feed-container">
                        {postsExists && posts.map((post) => (
                            <div key={post.id} className="post-card">
                                <h1>{post.title}</h1>
                                <p>By: {post.author}</p>
                                <p>{post.description}</p>
                                {post?.image && (
                                    <img 
                                        src={`http://localhost:8000${post.image}`} 
                                        alt={post.title} 
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );

};

export default Profile;
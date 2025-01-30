import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from './UserContext';
import axios from 'axios';


/* TODO: Make url based on the username ie, localhost.com/Tester1
will show the profile for that user */
const Profile = () => {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [postsExists, setPostsExists] = useState(true);

    if(!user){
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <Link to="/edit">Edit Profile</Link>
            {/* <div key={post.id} className="post-card">
                    <h1>{post.title}</h1>
                    <p>By: {post.author}</p>
                    <p>{post.description}</p>
                    {post?.image && (
                        <img 
                            src={`http://localhost:8000${post.image}`} 
                            alt={post.title} 
                        />
                    )}
            </div> */}
        </div>
    );

};

export default Profile;

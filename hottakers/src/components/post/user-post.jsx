import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const user_post = () => {
    const [post, setPosts] = useState([]);
    const { postId } = useParams();
    const [postsExists, setPostsExists] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try{
            const response = await axios.get(`/api/posts/${postId}/`);
            setPosts(response.data);
            setPostsExists(true);
            } catch (err) {
                console.log(err);
                setPostsExists(false);
            }
        }
        fetchPosts();
    }, [postId]);

    return (
        <div>
            {postsExists ? (
            <div className="post-container">
                <h1>{post.title}</h1>
                <p>{post.author}</p>
                <p>{post.description}</p>
                {post?.image && (
                    <img src= {`http://localhost:8000${post?.image}`} alt={post.title} />
                )}
            </div>
            ) : (
                <h1>Post not found</h1>
            )}
        </div>
    );
};



export default user_post
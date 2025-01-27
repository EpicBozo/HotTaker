import React, { useState, useEffect } from 'react';

const feed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch posts
        const fetchPosts = async () => {
            try{
                const response = await axios.get('/api/posts/');
                setPosts(response.data);
            } catch(err){
                console.log('Error response:', err.response?.data);
            }
    };
    fetchPosts();
    }, []);

    return (
        <div>
            <h1>Feed</h1>
            {posts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <img src={post.image} alt={post.title}/>
        </div>
        ))}
    );

export default feed;
import {useEffect, useState} from 'react';
import axios from 'axios';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [postsExists, setPostsExists] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try{
                const response = await axios.get('/api/feed/');
                setPosts(response.data);
                setPostsExists(true);
            } catch (err) {
                console.log(err);
                setPostsExists(false);
            }
        }
        fetchPosts();
    }, []);
    return (
        <div className="feed-container">
        {postsExists ? (
            posts.map((post) => (
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
            ))
        ) : (
            <p>No posts found</p>
        )}
        </div>
        
    );
};

export default Feed;
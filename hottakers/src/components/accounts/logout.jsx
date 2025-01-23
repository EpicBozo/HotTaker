import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.get('/api/logout/');
                console.log('Logged out');
                localStorage.removeItem('user');
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        };

        logout();
    }, [navigate]);

    return null;
};

export default Logout;
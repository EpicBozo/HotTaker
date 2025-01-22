import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/signup/', formData);
            if (response.data.success) {
                setShowModal(true);
            }
        } catch (err) {
            if (err.response) {
                const errors = err.response.data;
                const errorMessage = Object.values(errors).flat()
                setError(errorMessage[0])
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password1" className="text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password1"
                            name="password1"
                            placeholder="Enter your password"
                            value={formData.password1}
                            onChange={handleChange}
                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password2" className="text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="password2"
                            name="password2"
                            placeholder="Confirm your password"
                            value={formData.password2}
                            onChange={handleChange}
                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button 
                        className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-md w-96">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up Successful</h2>
                        <p className="text-gray-700 mb-4 text-center">Your account has been created. Please check your email for verification.</p>
                        <Link to="/login" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 block text-center">
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
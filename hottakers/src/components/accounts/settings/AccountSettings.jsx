import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../../accounts/UserContext';
import Modal from 'react-bootstrap/Modal';
import '../../../css/AccountSettings.css';
import axios from 'axios';


const AccountSettings = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState(null); // State to track which modal is open
    const [error, setError] = useState(null);
    const { 
        register: registerUsername, 
        handleSubmit: handleSubmitUsername, 
        formState: { errors: usernameErrors, isSubmitting: isUsernameSubmitting },
        watch: watchUsername,
        setValue: setUsernameValue,
        reset: resetUsername
    } = useForm({
        defaultValues: {
          username: "",
          password: ""
        }
    });
    
    const { 
        register: registerEmail, 
        handleSubmit: handleSubmitEmail, 
        formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
        watch: watchEmail,
        setValue: setEmailValue,
        reset: resetEmail
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });
    
    const{
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
        watch: watchPassword,
        setValue: setPasswordValue,
        reset: resetPassword
        } = useForm({
            defaultValues: {
                newPassword: "",
                confirmPassword: ""
            }
        });

    const handleClose = () => {
        console.log('Modal closing, current type:', modalType);
        setModalType(null);
        setError(null);
        resetUsername();
        resetEmail();
    };
    
    const handleShow = (type) => {
        console.log('Opening modal for:', type);
        setModalType(type);
    };

    const onSubmit = async (data) => {
        console.log("=== Form Submission Started ===");
        console.log("Form Data:", data);
        console.log("Modal Type:", modalType);

        try {
            //CSRF token stuff idk ngl
            console.log("Fetching CSRF token...");
            const csrfResponse = await axios.get("/api/csrf/", {
                withCredentials: true
            });
            console.log("CSRF Response:", csrfResponse);
            const csrfToken = csrfResponse.data.csrfToken;

            let endpoint
            switch(modalType){
                case 'username':
                    endpoint = '/api/change-username/';
                    break;
                case 'email':
                    endpoint = '/api/change-email/';
                    break;
                case 'phone':
                    endpoint = '/api/change-phone/';
                    break;
                default:
                    console.log('Invalid modal type');
                    return;
            }

            const response = await axios.post(endpoint, data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'X-CSRFToken': csrfToken,
                },
                withCredentials: true
              });
              
            console.log('API Response:', response);
            if(response.data){
                console.log('Form submission successful');
                setError(null);
                reset();
                handleClose();
            }
        }
        catch (err) {
            console.error('Form submission error:', err);
            console.error('Error response:', err.response?.data);
            const errorMessages = []

            if(err.response?.data){
                Object.entries(err.response.data).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        errorMessages.push(...messages);
                    } else if (typeof messages === 'string') {
                        errorMessages.push(messages);
                    }
                });
            }
            setError(errorMessages[0]);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }

        setLoading(false);
    }, [isAuthenticated]);

    if (loading || !user) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <div>Account Settings</div>
            <img
                src={`http://localhost:8000${user?.pfp}`}
                alt="profile"
                className="w-10 h-10 rounded-full"
            />
            <div className="username">
                <p>Username: {user.username}</p>
                <button className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-400 active:bg-gray-300 transition duration-200" onClick={() => handleShow('username')}>Edit</button>
            </div>
            <div className="email">
                <p>Email: {user.email}</p>
                <button className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-400 active:bg-gray-300 transition duration-200" onClick={() => handleShow('email')}>Edit</button>
            </div>
            {user.phone ? (
                <>
                    <p>Phone: {user.phone}</p>
                    <button className="ml-10">Edit</button>
                </>
            ) : (
                <p>Phone number not provided</p>
            )}
            <p>Bio: {user.bio}</p>
            <p>Member since: {user.date_joined}</p>

            <div className = "change_password" onClick={() => handleShow('password')}>
                <button className="w-2xl bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">Change Password</button>
            </div>

            {/* Username Modal */}
            <Modal show={modalType === 'username'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Username</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter your new username and existing password</p>
                    {error && typeof error === 'string' && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmitUsername(onSubmit)}>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="New Username"
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                {...registerUsername("username", { required: "Username is required" })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                {...registerUsername("password", { required: "Password is required" })}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isUsernameSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isUsernameSubmitting}
                        >
                            Save Changes
                        </button>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Email Modal */}
            <Modal show={modalType === 'email'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter new Email and password</p>
                    {error && typeof error === 'string' && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmitEmail(onSubmit)}>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="New Email"
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                {...registerEmail("email", { required: "Email is required" })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                {...registerEmail("password", { required: "Password is required" })}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isEmailSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isEmailSubmitting}
                        >
                            Save Changes
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
            
            {/* Password Modal */}
            <Modal show={modalType === 'password'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter your new username and existing password</p>
                    {error && typeof error === 'string' && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmitPassword(onSubmit)}>
                        <div className="input-container">
                            <input
                                type="password"
                                placeholder="New Password"
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                {...registerPassword("newPassword", { required: "New password is required" })}
                            />
                            <input
                                type="password"
                                placeholder="Confrim Password"
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                {...registerPassword("confirmPassword", { required: "Confirm password is required" })}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isPasswordSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isPasswordSubmitting}
                        >
                            Save Changes
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
    }

export default AccountSettings;
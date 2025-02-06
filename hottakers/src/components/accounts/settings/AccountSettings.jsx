import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../../accounts/UserContext';
import Modal from 'react-bootstrap/Modal';
import '../../../css/AccountSettings.css';
import axios from 'axios';


// change onsubmit back to deafult
// change the useForm values they may be creating an issue
// i gotta finish this bruh
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
        setValue: setUsernameValue
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
        setValue: setEmailValue
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });
    
    // Fix username modal not opening type
    const handleClose = () => {
        console.log('Modal closing, current type:', modalType);
        setModalType(null);
        setError(null);
        reset();
        console.log('Form reset, new values:', watch());
    };
    
    const handleShow = (type) => {
        console.log('Opening modal for:', type);
        console.log('Current form values:', watch());
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

            const response = await axios.post('/api/change-username/', data, {
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

    useEffect(() => {
        console.log("Form initialized with values:", watch());
    }, [watch]);

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
                <button onClick={() => handleShow('username')}>Edit</button>
            </div>
            <div className="email">
                <p>Email: {user.email}</p>
                <button onClick={() => handleShow('email')}>Edit</button>
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
                    <form onSubmit={handleSubmit(onSubmit)}>
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

            {/* Email Modal */}
            <Modal show={modalType === 'email'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter your new email and existing password</p>
                    {error && typeof error === 'string' && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}
                     <form 
                        onSubmit={(e) => {
                            console.log("Form submit event triggered");
                            handleSubmit((data) => {
                                console.log("handleSubmit callback triggered with data:", data);
                                onSubmit(data);
                            })(e);
                        }}
                    >
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="New Email"
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                {...register("password", { required: "Password is required" })}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
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
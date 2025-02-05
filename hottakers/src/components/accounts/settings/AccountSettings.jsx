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
    
    // Fix username modal not opening type
    const handleClose = () => {
        console.log('Modal closing');
        setModalType(null);
    };
    
    const handleShow = (type) => {
        console.log('Opening modal for:', type);
        setModalType(type);
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
        // Manage bio and Member since on hold for now

        <div>
            <div>Account Settings</div>
            <img
                  src= {`http://localhost:8000${user?.pfp}`}
                  alt="profile"
                  className="w-10 h-10 rounded-full"> 
                  
            </img>
            <div className="username" onClick={handleShow}>
                <p>Username: {user.username}</p>
                <button onClick={() => handleShow('username')}>Edit</button>
            </div>
            <div className="email">
                <p>Email: {user.email}</p>
                <button>Edit</button>
            </div>
            {user.phone ? 
            <>
                <p>Phone: {user.phone}</p>
                <button className="ml-10">Edit</button>
            </> 
            : <p>Phone number not provided</p>}
            <p>Bio: {user.bio}</p>
            <p>Member since: {user.date_joined}</p>

            {/* Username Modal */}
            {modalType === 'username' && (
                <Modal show={true} onHide={handleClose}>
                    <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Change Username</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Enter your new username and existing password</p>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="New Username"
                                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={handleClose}>Close</button>
                            <button>Save changes</button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
            )}
        </div>
    );
}

export default AccountSettings;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../accounts/UserContext';
import '../../css/settings_sidebar.css';
import axios from 'axios';

const SettingsSidebar = ({setActiveSection}) => {
    const { user, isAuthenticated } = useUser();
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li onClick={() => setActiveSection('account')}>Account</li>
                    <li onClick={() => setActiveSection('profile')}>Profile</li>
                    <li onClick={() => setActiveSection('notifications')}>Notifications</li>
                    <li onClick={() => setActiveSection('privacy')}>Privacy</li>
                    <li onClick={() => setActiveSection('security')}>Security</li>
                    <li onClick={() => setActiveSection('deactivate')}>Deactivate</li>
                </ul>
            </nav>
        </aside>
    );
}

export default SettingsSidebar;
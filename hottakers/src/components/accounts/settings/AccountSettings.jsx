import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../../accounts/UserContext';
import '../../../css/settings_sidebar.css';
import axios from 'axios';

const AccountSettings = () => {
    return (
        <div>
            <h2>Account Settings</h2>
            {/* Add your account settings content here */}
        </div>
    );
}

export default AccountSettings;
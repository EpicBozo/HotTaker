import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VerificationSuccess = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Account Verification</h2>
                <p className="text-gray-700 mb-4 text-center">Your account has been successfully verified.</p>
                <Link to="/login" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 block text-center">Continue</Link>
            </div>
        </div>
    );
};

export default VerificationSuccess;
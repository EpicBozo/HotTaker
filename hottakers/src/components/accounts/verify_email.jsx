import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { uidb64, token } = useParams();
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`/api/verify/${uidb64}/${token}/`);
                if (response.data.success) {
                    navigate('/verification-success');
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Verification failed');
                navigate('/verification-failed');
            } finally {
                setVerifying(false);
            }
        };

        verifyEmail();
    }, [uidb64, token, navigate]);

    if (verifying) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verifying Email</h2>
                    <p className="text-gray-700 mb-4 text-center">Please wait...</p>
                </div>
            </div>
        );
    }

    // The actual render won't happen as we redirect in all cases
    return null;
};

export default VerifyEmail;
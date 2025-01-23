import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { uid: uidb64, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                console.log(`/api/verify/${uidb64}/${token}/`)
                await axios.get(`/api/verify/${uidb64}/${token}/`);
                navigate('/verification-success');
            } catch (error) {
                navigate('/verification-failed');
            }
        };

        verifyEmail();
        
    }, [uidb64, token, navigate]);

    return null;

};

export default VerifyEmail;
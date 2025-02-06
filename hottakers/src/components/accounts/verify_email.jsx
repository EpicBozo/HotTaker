import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { uid: uidb64, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try{
                let endpoint;
                const path = window.location.pathname;
                const type = path.split('/')[1];

                switch(type){
                    case 'verify-email':
                        console.log('New email verification');
                        endpoint = `/api/verify-email/${uidb64}/${token}/`;
                        break;
                    case 'reset-password':
                        endpoint = 'not set yet';
                        break;
                    case 'verify':
                        console.log('sign up verification');
                        endpoint = `/api/verify/${uidb64}/${token}/`;
                        break;
                    default:
                        break;
                }

                const response = await axios.get(endpoint);
                if(response.data.success){
                    navigate('/verification-success');
                } else{
                    navigate('/verification-failed');
                }
            } catch (error) {
                console.log(error);
                navigate('/verification-failed');
            }
        };

        verifyEmail();
        
    }, [uidb64, token, navigate]);

    return null;

};

export default VerifyEmail;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { uid: uidb64, token } = useParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            if(!isVerifying) return;

            try{
                let endpoint;
                const path = window.location.pathname;
                const type = path.split('/')[1];

                switch(type) {
                    // ts pmo why is it double verifiyng, ima leave it for now
                    // need claude to be back up
                    case 'verify-email':
                        console.log('Attempting email change verification');
                        endpoint = `/api/verify-email/${uidb64}/${token}/`;
                        break;
                    case 'verify':
                        console.log('Attempting signup verification');
                        endpoint = `/api/verify/${uidb64}/${token}/`;
                        break;
                    default:
                        console.log('Unknown verification type:', type);
                        throw new Error('Invalid verification type');
                }
                setIsVerifying(false);

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
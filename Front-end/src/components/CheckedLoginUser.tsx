import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../authentication/AuthState';


interface CheckUserProps {
  children: React.ReactElement;
}


const CheckedUser = (props : CheckUserProps) => {
  const {authenticated} = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
};

export default CheckedUser;
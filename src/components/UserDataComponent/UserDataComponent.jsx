import axios from 'axios';
import './UserDataComponent.css'
import React, { useEffect, useState } from 'react';

const UserDataComponent = () => {
  const [userData, setUserData] = useState('');

  useEffect(() => {
    axios.post(`http://localhost:3500/api/v1/userdata`,{
      token: window.localStorage.getItem('token'),
    })
    .then((response) => {
      console.log(response.data)
        setUserData(response.data)
    })
    .catch((error) => {
      alert(`Status : ${error.response.status} - ${error.response.data.message}`)
  })
  }, []);

  return (
    <React.Fragment>
      <div class="navbar">
    <h1>User Details</h1>
    <div class="user-details">
        <div class="user-info">
            <p>First Name:</p>
            <h4>{userData.firstName}</h4>
        </div>
        <div class="user-info">
            <p>Last Name:</p>
            <h4>{userData.lastName}</h4>
        </div>
        <div class="user-info">
            <p>Email:</p>
            <h4>{userData.email}</h4>
        </div>
    </div>
</div>

      
    </React.Fragment>
  );
};

export default UserDataComponent;

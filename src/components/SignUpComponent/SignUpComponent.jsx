import React, { useState } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import './SignUpComponent.css'; 
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
        
import { Dropdown } from 'primereact/dropdown';



const SignupComponent = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [role, setRole] = useState('customer')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    const firstNameHandler = (event) => {
        setFirstName(event.target.value)
    }

    const lastNameHandler = (event) => {
        setLastName(event.target.value)
    }
    
    const roleHandler = (event) => {
        setRole(event.target.value)
    }

    const emailHandler = (event) => {
        setEmail(event.target.value)
    }

    const passwordHandler = (event) => {
        setPassword(event.target.value)
    }

    const formSubmitHandler = (event) => {
        event.preventDefault()
        
        axios
        .post(`http://localhost:3500/api/v1/signup`,{firstName,lastName,role, email,password})
        .then((response) => {
            alert(`Successfully created account for ${response.data.firstName} ${response.data.lastName} !`)
            window.location.href = '/'
        })
        .catch((error) => {
            alert(`Status : ${error.response.status} - ${error.response.data.message}`)
        })
    }

  return (
    <form onSubmit={formSubmitHandler} >
        <h1>Sign up</h1>

        <div className='mb-3'>
            <label>First Name</label>
            <input 
                type='text'
                className='form-control'
                placeholder='Enter your first name'
                value={firstName}
                onChange={firstNameHandler}
                required
            />
        </div>

        <div className='mb-3'>
            <label>Last Name</label>
            <input
                type='text'
                className='form-control'
                placeholder='Enter your last name'
                value={lastName}
                onChange={lastNameHandler}
                required
            />
        </div>
        <div class="select-wrapper">
    <label for="role">Role</label>
    <select id="role" name="role" value={role} onChange={roleHandler} required>
        <option value="customer">Customer</option>
        <option value="delpersonnel">Delivery Personnel</option>
        <option value="admin">Admin</option>
    </select>
</div>
        <div className='mb-3'>
            <label>Email</label>
            <input
                type='email'
                className='form-control'
                placeholder='Enter your email address'
                value={email}
                onChange={emailHandler}
                required
            />
        </div>

        <div className='mb-3'>
            <label>Password</label>
            <input
                type='password'
                className='form-control'
                placeholder='Enter your password'
                value={password}
                onChange={passwordHandler}
                required
            />
        </div>

        <div className='d-grid'>
            <button type='submit' className='btn btn-danger' >Submit</button>
        </div>

        <p className='forgot-password text-right'>
            Already registered, <Link to='/login' className='link-danger'>Login here?</Link>
        </p>

      </form>
  )
}

export default SignupComponent
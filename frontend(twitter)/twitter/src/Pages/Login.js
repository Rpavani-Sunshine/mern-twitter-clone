import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { Base_url } from '../Config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const Login = () => {
    const [Email, SetEmail] = useState("")
    const [Password, SetPassword] = useState("")
    const [Loading, SetLoading] = useState(false)
    const Navigate = useNavigate()
    const Dispatch = useDispatch()

    // Login functionality
    const loginHandler = async (e) => {
        try {
            SetLoading(true)
            e.preventDefault()
            const data = await axios.post(`${Base_url}/auth/login`, {
                Email: Email,
                Password: Password
            })
            if (data.status === 200) {
                SetLoading(false)
                localStorage.setItem("token", data.data.token)
                localStorage.setItem("user", JSON.stringify(data.data.user))
                Dispatch({ type: 'LOGIN_SUCCESS', payload: data.data.user })
                Navigate("/")
                toast.success("User logged in successfully")
                SetEmail("")
                SetPassword("")
            }
        } catch (err) {
            SetLoading(false)
            SetEmail("")
            SetPassword("")
            toast.error(err.response.data.msg)
        }
    }

    return (
        // Login UI
        <div className='container loginContainer'>
            <ToastContainer />
            <div className='row m-auto mt-5 loginBlock bg-body-secondary'>
                {/* App Logo */}
                <div className="col-md-6">
                <div className='p-lg-4 mt-lg-5'>
                    <h5 className='fw-bold fs-2 ms-5 mt-2'>Welcome Back</h5>
                    <FontAwesomeIcon className='logo-size ms-5 mt-2' icon={faTwitter}/>
                </div>
                </div>
                {/* Login form */}
                <div className="col-md-6">
                    <div className='px-lg-3 p-3'>
                        <p className='mainheading2 fw-bold fs-2 mb-lg-5'>Join today.</p>
                        <form className='form' onSubmit={(e) => loginHandler(e)} >
                            {Loading ? <div className="spinner-border " style={{ marginLeft: "200px" }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> : ""}
                            <div className="mb-3">
                                <label for="formGroupExampleInput" className="form-label float-start fw-bold">Email</label>
                                <input type="email" className="form-control bg-light " value={Email} onChange={(e) => SetEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label for="formGroupExampleInput2" className="form-label float-start fw-bold">Password</label>
                                <input type="Password" className="form-control bg-light " value={Password} onChange={(e) => SetPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                            <button className='form-control btn btn-dark my-2' type='submit' >Login</button>
                            </div>
                        </form>
                        <div className='row '>
                            <p className='text-start my-3 mx-2 fw-bold'>New User ? <NavLink to="/register">   Create Your Account</NavLink> </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
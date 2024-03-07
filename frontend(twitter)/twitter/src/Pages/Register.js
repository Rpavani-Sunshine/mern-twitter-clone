import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import axios from 'axios'
import { Base_url } from '../Config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, useNavigate } from 'react-router-dom'

const Register = () => {
    const [Email, SetEmail] = useState("")
    const [FullName, SetFullName] = useState("")
    const [UserName, SetUserName] = useState("")
    const [Password, SetPassword] = useState("")
    const [Loading, SetLoading] = useState(false)

    const requestData = {
        Name: FullName,
        UserName: UserName,
        Email: Email,
        Password: Password
    }
    const Navigate = useNavigate()

    // Registration (newUser SignIn) functionality
    const RegisterController = async (e) => {
        try {
            SetLoading(true)
            e.preventDefault()
            const data = await axios.post(`${Base_url}/auth/register`, requestData)
            console.log(data)
            if (data.status === 200) {
                SetLoading(false)
                toast.success("Registered sucessfully")
                Navigate("/login")
            }
        } catch (err) {
            SetLoading(false)
            toast.error(err.response.data.msg)
            console.log(err)
        }
    }

    return (
        // Registration UI
        <div className='container loginContainer'>
            <ToastContainer />
            <div className='row m-auto mt-5 loginBlock bg-body-secondary'>
                {/* App Logo */}
                <div className="col-md-6">
                    <div className='p-lg-4 mt-lg-5'>
                        <h5 className='fw-bold fs-2 ms-5 mt-5'>Welcome Back</h5>
                        <FontAwesomeIcon className='logo-size ms-5 mt-2' icon={faTwitter} />
                    </div>
                </div>
                {/* Registration Form */}
                <div className="col-md-6">
                    <div className='px-lg-3 p-3'>
                        <h3 className='fw-bold text-center '>Register</h3>
                        <form className='form' onSubmit={(e) => RegisterController(e)} >

                            {Loading ? <div className="spinner-border " style={{ marginLeft: "200px" }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> : ""}

                            <div className="mb-3">
                                <label for="formGroupExampleInput" className="form-label float-start fw-bold">Name</label>
                                <input type="text" className="form-control bg-light " value={FullName} onChange={(e) => SetFullName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label for="formGroupExampleInput" className="form-label float-start fw-bold">UserName</label>
                                <input type="text" className="form-control bg-light " value={UserName} onChange={(e) => SetUserName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label for="formGroupExampleInput" className="form-label float-start fw-bold">Email</label>
                                <input type="email" className="form-control bg-light " value={Email} onChange={(e) => SetEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label for="formGroupExampleInput2" className="form-label float-start fw-bold">Password</label>
                                <input type="Password" className="form-control bg-light " value={Password} onChange={(e) => SetPassword(e.target.value)} />
                            </div>
                            <button className='btn btn-dark float-start my-2' type='submit' >Register</button>
                        </form>
                        <div className='row '>
                            <p className='text-start my-3 mx-2 fw-bold'>Already registerd ? <NavLink to="/login"> Log in</NavLink> </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
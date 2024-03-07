import React, { useEffect, useState } from 'react'
import Sidebar from '../component/Sidebar'
import "./home.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faCakeCandles, faCalendarDays, faLocationDot, faHeart, faRetweet, faImage, faComment } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Base_url } from "../Config/config"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom'


const Profile = () => {
  const { UserId } = useParams()
  const [image, setImage] = useState({ preview: " ", data: " " })
  const [UserData, setUserData] = useState()
  const [loading, setloading] = useState(true)
  const [userTweet, setUserTweet] = useState([])
  const [followed, setFollowed] = useState(false)
  const [btn, setbtn] = useState("follow")
  const [Name, setName] = useState("")
  const [date, setdate] = useState("")
  const [Show, setShow] = useState(false)
  const [Reply, setReply] = useState("")
  const [Liked, setLiked] = useState(false)
  const [Location, setLocation] = useState("")
  const loggedInUser = JSON.parse(localStorage.getItem("user"))
  const Dispatch = useDispatch()
  const config = {
    headers: {
      "Content-type": "application/json",
      "authorization": "Bearer " + localStorage.getItem("token")
    }

  }

  
  const ProfileData = async () => {
    try {
      const data = await axios.get(`${Base_url}/auth/User/${UserId}`)
      if (data.status === 200) {
        if (data.data.user.Followers.find(p => p === loggedInUser._id)) {
          console.log("you followed this profile")
          setFollowed(true)
          setbtn("Unfollow")
        }
        setUserData(data.data.user)
        setUserTweet(data.data.UserTweet)
        setloading(false)
        setName(data.data.user.Name)
        setdate(data.data.user.DOB)

        console.log(data)
      }

    }
    catch (err) {
      console.log(err)
      setloading(false)
      toast.error(err.response.data.msg || "Internal server Error")
    }
  }

  const clickBtn = async () => {
    try {
      if (followed) {
        const resp = await axios.get(`${Base_url}/Unfollow/User/${UserId}`, config)
        if (resp.status === 200) {
          console.log(resp.data)
          setbtn("follow")
          setFollowed(false)
          toast.info(`you Unfollowed ${UserData.Name}`)
        }
      }
      else if (!followed) {
        const resp = await axios.get(`${Base_url}/follow/User/${UserId}`, config)
        if (resp.status === 200) {
          console.log(resp.data)
          setbtn("Unfollow")
          setFollowed(true)
          toast.info(`you followed ${UserData.Name}`)
        }
      }
      ProfileData()
    } catch (err) {
      console.log(err)
    }

  }
  const handleFile = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0]
    }
    setImage(img)
  }
  const handleImageupload = async () => {
    try {
      const formdata = new FormData()
      formdata.append('file', image.data)
      const response = await axios.post(`${Base_url}/upload`, formdata)
      return response;

    }
    catch (err) {
      console.log(err)
    }
  }


  const uploadProfilePic = async () => {
    try {
      const response = await handleImageupload()
      const data = await axios.put(`${Base_url}/User/uploadPP`, {
        ProfilePic: `${Base_url}/files/${response.data.filename}`
      }, config)
      if (response.status === 200) {
        console.log(data.data)
        Dispatch({ type: "LOGIN_SUCCESS", payload: data.data.tweets })
        ProfileData()
        setImage({ preview: "", data: "" })

        toast.info("Profile Picture Updated")
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  const EditData = async () => {
    try {
      const data = await axios.put(`${Base_url}/Edit/User`, {
        Name: Name,
        DOB: date,
        Location: Location
      }, config)
      if (data.status === 201) {
        Dispatch({ type: "LOGIN_SUCCESS", payload: data.data.user })
        ProfileData()
        console.log(data.data)
        toast.info("profile has been updated")
        setName("")
        setdate("")
        setLocation("")
      }
    } catch (err) {
      console.log(err)
    }

  }
  const comment = (e) => {
    e.preventDefault()
    if (Show) {
      setShow(false)
    } else
      setShow(true)

  }
  const ReplyTweet = async (id, e) => {
    try {
      e.preventDefault()
      const replied = await axios.post(`${Base_url}/Reply/tweet/${id}`, {
        Content: Reply
      }, config)
      if (replied.status === 200) {
        toast.success("you Replied the tweet")
        ProfileData()
        setShow(false)
        setReply("")
      }
    } catch (err) {
      console.log(err)
    }
  }
  const action = async (id) => {
    try {
      if (!Liked) {
        const likedT = await axios.get(`${Base_url}/Like/tweet/${id}`, config)
        if (likedT.status === 200) {
          toast.info("You Liked the Tweet")

          setLiked(true)

        }

      } else if (Liked) {
        const DislikeT = await axios.get(`${Base_url}/DisLike/tweet/${id}`, config)
        if (DislikeT.status === 200) {
          toast.warn("You Dislike the Tweet")

          setLiked(false)

        }

      }
      ProfileData()
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.msg || "Internal server Error")
    }
  }




  useEffect(() => {
    ProfileData(UserId)


  }, [UserId])

  return (
    //
    <div className='container mt-5'>
      <div className='row'>
        <Sidebar />
        <div className='col-md-9' >
          {loading ? (<p>loading</p>) : (
            <div className='row bg-body-secondary' >
              <div className='d-flex  bg-light justify-content-between' style={{ marginTop: "100px", backgroundColor: "rgb(29 ,161 ,242)" }}>
                <img className="profile-pic ms-md-2" style={{ height: "80px", width: "80px", borderRadius:"100%" }} src={UserData.ProfilePic} alt="Profile Picture" />
                {loggedInUser._id === UserId ? (
                  <div>
                    <button className='btn btn-outline-primary my-3 mx-1 ms-5 text-center uploadbtn  h-50' data-bs-toggle="modal" data-bs-target="#DPModal"> Uplaod ProfilePic</button>
                    <button className='btn btn-outline-danger my-3 mx-1 h-50 editbtn' data-bs-toggle="modal" data-bs-target="#EditModal">Edit</button>
                  </div>
                ) : (<button className='btn btn-dark my-3 h-50' onClick={() => clickBtn()}>{btn}</button>)}
              </div>



              <div className='bg-light'>
                <p className='fw-bold mx-4' >{UserData.Name}</p>
                <p className='text-muted mx-4' style={{ marginTop: "-20px" }}>{UserData.UserName}</p>
                <div className='row'>
                  <div className='col-12'>
                    {
                      UserData.DOB ? <><FontAwesomeIcon className='me-1' icon={faCakeCandles} /> DOB  {new Date(UserData.DOB).getDate()}-{new Date(UserData.DOB).getMonth() + 1}-{new Date(UserData.DOB).getFullYear()}</>
                      : <><FontAwesomeIcon className='me-1' icon={faCakeCandles} /> DOB  </>
                    }
                    <FontAwesomeIcon className="ms-5" icon={faLocationDot} /> Location {UserData.Location}
                  </div>


                  <div className='col-12'>
                    <FontAwesomeIcon className='me-2' icon={faCalendarDays} />Joined {new Date(UserData.createdAt).getDate()}-{new Date(UserData.createdAt).getMonth() + 1}-{new Date(UserData.createdAt).getFullYear()}
                  </div>


                </div>
                <div className='d-flex my-3 '>
                  <h6 className='fw-bold '>{UserData.Following.length} Following </h6>
                  <h6 className='fw-bold mx-3'> {UserData.Followers.length} Followers </h6>
                </div>
              </div>
              <div className='bg-light' >
                <h4 className='text-center'>Tweets and Reply</h4>
                {userTweet.map(P => {
                  return (
                    <div className="card w-75  mt-2  ms-5">
                      {/* <p className='text-muted ms-3 fs-6 fw-bold'> <FontAwesomeIcon icon={faRetweet} style={{ color: "#19c836", }} />  Retweeted by</p> */}
                      <div className='d-flex '>
                        <img className="profile-pic ms-md-2" src={UserData.ProfilePic} alt="Profile Picture" />
                        <p className=' card-text fw-bold ' >{UserData.Name}</p>
                        <p className='card-text text-muted mb-0'>- {new Date(P.createdAt).getDate()}-{new Date(P.createdAt).getMonth() + 1}-{new Date(P.createdAt).getFullYear()} </p>
                      </div>
                      <div className="card-body">
                        <h6 className="card-title">{P.Content}</h6>
                        {P.Image ?
                          <div className='photo-wrapper '>
                            <img
                              src={P.Image}
                              className="img-fluid " // Use 'img-fluid' to ensure responsive images
                              alt="Logo"
                            />
                          </div>
                          : ""}
                        <div className='mt-4'>
                          <FontAwesomeIcon className='mx-3 btn' onClick={(e) => action(P._id)} icon={faHeart} style={{ color: "#ec0909" }} />{P.Likes.length}
                          <FontAwesomeIcon className='mx-3 btn' onClick={(e) => comment(e)} icon={faComment} style={{ color: "#a2b9e2", }} />

                          <FontAwesomeIcon className='mx-3 btn' icon={faRetweet} style={{ color: "#19c836", }} />
                          {Show ?
                            <form className='d-flex' onSubmit={(e) => ReplyTweet(P._id, e)}>
                              <input className='form-control w-50' type='text' onChange={(e) => setReply(e.target.value)} placeholder='Reply your tweet' />
                              <input className="btn btn-tweet ms-2" type='submit' />
                            </form> : ""

                          }
                        </div>
                      </div>
                    </div>


                  )
                })}

              </div>


            </div>


          )}


        </div>
        <div className="modal fade" id="DPModal" tabindex="-1" aria-labelledby="twitterModelLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="twitterModelLabel">Upload your profilepic</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* <button className='opacity-75 fw-bold my-4'  >
                  <FontAwesomeIcon icon={faImage} size='xl' />
                  Click here */}
                <input type='file' onChange={(e) => handleFile(e)} />

                {(image.preview) ?
                  <img className='img-fluid' src={image.preview} /> : " "

                }

              </div>
              <div className="modal-footer">

                <button type="button" onClick={(e) => uploadProfilePic()} data-bs-dismiss="modal" className="btn btn-primary">Upload</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="EditModal" tabindex="-1" aria-labelledby="twitterModelLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="twitterModelLabel">update profile</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input type='text' className='form-control mb-3' value={Name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
                <input type='date' className='form-control mb-3' value={date} onChange={(e) => setdate(e.target.value)} placeholder='Date Of Birth' />
                <input type='text' className='form-control mb-3' value={Location} onChange={(e) => setLocation(e.target.value)} placeholder='Location' />
              </div>
              <div className="modal-footer">

                <button type="button" onClick={(e) => EditData(e)} data-bs-dismiss="modal" className="btn btn-primary">Upload</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
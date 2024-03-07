import React, { useEffect, useState } from 'react'
import Sidebar from '../component/Sidebar'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart, faRetweet, faComment, faImage, faTrash } from "@fortawesome/free-solid-svg-icons"
import "./home.css"
import axios from 'axios'
import { Base_url } from "../Config/config"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import trendings from '../constant'

const Home = () => {
    const [image, setImage] = useState({ preview: " ", data: " " })
    const [Content, setContent] = useState("")
    const [loading, setloading] = useState(false)
    const [tweets, settweets] = useState([])
    const [Liked, setLiked] = useState(false)
    const [Reply, setReply] = useState("")
    const [Show, setShow] = useState(false)

    const user = JSON.parse(localStorage.getItem("user"))
    const Navigate = useNavigate()

    const config = {
        headers: {
            "Content-type": "application/json",
            "authorization": "Bearer " + localStorage.getItem("token")
        }

    }
    const handleFile = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img)
        setloading(true)
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

    const tweet = async (e) => {
        try {
            e.preventDefault()

            if (loading) {
                const imageRes = await handleImageupload()
                const tweetdata = await axios.post(`${Base_url}/Create/tweet`, {
                    Content: Content,
                    Image: `${Base_url}/files/${imageRes.data.filename}`
                }, config)
                if (tweetdata.status === 201) {

                    toast.success("tweet Uploaded")
                    setImage({ preview: "", data: " " })
                    setContent("")
                    setloading(false)
                    showAlltweet()
                }
                return
            }
            const tweetdata = await axios.post(`${Base_url}/Create/tweet`, {
                Content: Content,
            }, config)
            if (tweetdata.status === 201) {
                toast.success("tweet Uploaded")
                setImage({ preview: "", data: " " })
                setContent("")
            }
            showAlltweet()

        }
        catch (err) {
            toast.error(err.response.data.msg || "Internal server Error")
        }
    }

    const showAlltweet = async (e) => {
        try {
            const data = await axios.get(`${Base_url}/tweet`,)
            if (data.status === 200) {
                settweets(data.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const deleteTweet = async (id) => {
        try {

            const response = await axios.delete(`${Base_url}/Delete/tweet/${id}`, config)
            if (response.status === 200) {
                toast.warn("tweeet deleted")
                showAlltweet()
            }
        }
        catch (err) {
            toast.error(err.response.data.msg || "Internal server Error")
        }
    }
    const action = async (id) => {
        try {
            if (!Liked) {
                const likedT = await axios.get(`${Base_url}/Like/tweet/${id}`, config)
                if (likedT.status === 200) {
                    toast.info("You Liked the Tweet")

                    setLiked(true)
                    showAlltweet()
                }

            } else if (Liked) {
                const DislikeT = await axios.get(`${Base_url}/DisLike/tweet/${id}`, config)
                if (DislikeT.status === 200) {
                    toast.warn("You Dislike the Tweet")

                    setLiked(false)
                    showAlltweet()
                }
            }
        } catch (err) {
            toast.error(err.response.data.msg || "Internal server Error" || "Internal server Error")
        }
    }

    const ReplyTweet = async (id, e) => {
        try {
            e.preventDefault()
            const replied = await axios.post(`${Base_url}/Reply/tweet/${id}`, {
                Content: Reply
            }, config)
            if (replied.status === 200) {
                toast.success("you Replied the tweet")
                showAlltweet()
                setShow(false)
                setReply("")
            }
        } catch (err) {
            console.log(err.response.data.msg || "Internal server Error")
        }


    }
    const comment = (e) => {
        e.preventDefault()
        if (Show) {
            setShow(false)
        } else
            setShow(true)

    }

    const Retweet = async (id) => {
        try {
            const retweetdata = await axios.get(`${Base_url}/Retweet/${id}`, config)
            if (retweetdata.status === 200) {
                showAlltweet()
                toast.info("you Retweeted")
            }

        } catch (err) {
            toast.error(err.response.data.msg || "Internal server Error")
        }

    }
    const otherProfile = (id) => {
        Navigate(`/Profile/${id}`)
    }


    useEffect(() => {
        showAlltweet()

    }, [])

    return (
        <div className="container mt-2">
            <div className="row ms-md-2 ps-md-5 " >
                <Sidebar />
                <div className="col-md-6 bg-light" id='section1'>
                    <div className='d-flex justify-content-between mt-2'>
                        <h3 className='fw-bold ms-md-5 ps-md-3'>For you</h3>
                        <button className='btn btn-dark tweetbtn w-25 fw-bold fs-5' style={{ marginRight: "7rem" }} data-bs-toggle="modal" data-bs-target="#twitterModel">Tweet</button>
                    </div>
                    {tweets.map(p => {
                        return (
                            <div className="card w-100 mt-2 ">
                                <div className='d-flex mt-2 justify-content-end'>
                                    {p.TweetedBy._id === user._id ? <FontAwesomeIcon onClick={() => deleteTweet(p._id)} className='me-2' icon={faTrash} /> : ""}
                                </div>
                                {p.Retweet.length > 0 ? <p className='text-muted ms-md-3 fs-6 fw-bold'> <FontAwesomeIcon icon={faRetweet} onClick={() => Retweet()} style={{ color: "#19c836", }} />Retweeted by {p.Retweet[0].Name}  </p> : ""}
                                <div className='d-flex '>
                                    <img className="profile-pic ms-md-2" onClick={() => otherProfile(p.TweetedBy._id)} src={p.TweetedBy.ProfilePic} alt="Profile Picture" />
                                    <p className=' card-text fw-bold  me-md-2'>{p.TweetedBy.Name}</p>
                                    <p className='fs-6 fw-bold text-muted mb-0'>  {new Date(p.createdAt).getDate()}/{new Date(p.createdAt).getMonth() + 1}/{new Date(p.createdAt).getFullYear()}</p>
                                </div>
                                <div className="card-body">
                                    <h6 className="card-title">{p.Content}</h6>
                                    {p.Image ?
                                        <div className='photo-wrapper '>
                                            <img
                                                src={p.Image}
                                                className="img-fluid " // Use 'img-fluid' to ensure responsive images
                                                alt="Logo"
                                            />
                                        </div>

                                        : ""}

                                    <div className='mt-4'>
                                        <FontAwesomeIcon className='me-1 btn' onClick={(e) => action(p._id)} icon={faHeart} style={{ color: "#ec0909" }} />{p.Likes.length}
                                        <FontAwesomeIcon className='me-1 btn' onClick={(e) => comment(e)} icon={faComment} style={{ color: "#a2b9e2", }} />

                                        <FontAwesomeIcon className=' btn' onClick={(e) => Retweet(p._id)} icon={faRetweet} style={{ color: "#19c836", }} />{p.Retweet.length}
                                        {Show ?
                                            <form className='d-flex' onSubmit={(e) => ReplyTweet(p._id, e)}>
                                                <input className='form-control w-50' type='text' onChange={(e) => setReply(e.target.value)} placeholder='Reply your tweet' />
                                                <input className="btn btn-tweet ms-2" type='submit' />
                                            </form>
                                            : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className="modal fade" id="twitterModel" tabindex="-1" aria-labelledby="twitterModelLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="twitterModelLabel">New Tweet</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div class="form-floating">
                                        <textarea class="form-control h-100" placeholder="Write Your Tweet" id="floatingTextarea2" value={Content} onChange={(e) => setContent(e.target.value)} ></textarea>
                                        <label for="floatingTextarea2">Write your tweet</label>
                                    </div>
                                    <input type='file' className='mt-5' onChange={(e) => handleFile(e)} />

                                    {(image.preview) ?
                                        <img className='img-fluid' src={image.preview} /> : " "

                                    }

                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={(e) => tweet(e)} data-bs-dismiss="modal" className="btn btn-primary">Tweet </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 bg-body-secondary'>
                    <section className='hidden rightsidebar lg:block bg-dark_soul h-screen w-[360px] border-x-2 border-slate-900'>
                        <div className='py-8'>
                            <ul className='bg-[#16181c] py-4 rounded-md'>
                                <li className='px-md-4 mb-4'>
                                    <h3 className='text-pure_soul font-bold text-lg'>What's happening</h3>
                                </li>
                                {trendings.map((trend, idx) => (
                                    <li
                                        key={idx}
                                        className='flex items-center justify-between py-2 px-md-4 bg-transparent hover:bg-neutral-950/50'
                                    >
                                        <div>
                                            <span className='text-slate-400 text-xs'>{trend.category}</span>
                                            <h4 className='text-bold text-slate-100 text-sm leading-[1.2]'>
                                                {trend.hashtag}
                                            </h4>
                                            <span className='text-slate-400 text-sm leading-[1.1]'>
                                                {trend.topic}
                                            </span>
                                        </div>
                                        {trend.image && (
                                            <img
                                                src={trend.image}
                                                className='w-[60px] h-[60px] object-cover rounded-md'
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Home
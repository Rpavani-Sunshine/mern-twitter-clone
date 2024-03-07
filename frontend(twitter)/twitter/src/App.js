import './App.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Sidebar from './component/Sidebar';
import Profile from './Pages/Profile';
import { BrowserRouter,Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Tweetdetails from './Pages/tweetdetails';
import { useEffect } from 'react';


function App() {

  const Dynamiroute=()=>{

   const Navigate=useNavigate()
   const token=localStorage.getItem("token")

   useEffect(()=>{
    if(token){
      Navigate("/")
    }
    else{
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      Navigate("/login")
    }
   },[])
   return(
      <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login'element ={<Login/>}/>
          <Route path='/'element ={<Home/>}/>
          <Route path='/TweetDetails/:tweetId'element ={<Tweetdetails/>}/>
          <Route path='/Profile/:UserId'element ={<Profile/>}/>
     </Routes>
   )
  }

  return (
    <div className="App">
     <BrowserRouter>
     <Dynamiroute/>
     <ToastContainer/>
     </BrowserRouter>
    </div>
  );
}

export default App;

import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Navbar from './components/Navbar'
import OtpPage from './pages/OtpPage';
import CreateBlogPage from './pages/CreateBlogPage';
import ViewDraft from './pages/ViewDraft';
import HomePage from './pages/HomePage';
import ViewBlog from './pages/ViewBlog';
import EditBlogPage from './pages/EditBlogPage';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/routeType/PrivateRoute';
import OpenOnlyRoute from './components/routeType/OpenOnlyRoute';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div className='bg-gray-100 min-h-[100vh]'>
      <Navbar />

      <Routes>

        <Route path= "/login" element={<OpenOnlyRoute>
          <Login/>
        </OpenOnlyRoute>} />

        <Route path= "/signup" element={<OpenOnlyRoute>
          <SignUp/>
        </OpenOnlyRoute>} />

        <Route path= "/send-otp" element={<OpenOnlyRoute>
          <OtpPage/>
        </OpenOnlyRoute>}/>

        <Route path="/createBlog" element = {<PrivateRoute>
          <CreateBlogPage/>
        </PrivateRoute>}/>
       

        <Route path= "/viewDraft" element={<ViewDraft/>} />
        <Route path= "/viewDraft/:id" element={<PrivateRoute>
          <ViewDraft/>
        </PrivateRoute>} />


        <Route path= "/" element={<HomePage/>} />
        
        <Route path= "/blog/:id" element={<ViewBlog/>} />

        <Route path= "/editBlog/:id" element={<PrivateRoute>
          <EditBlogPage/>
        </PrivateRoute>} />

        <Route path= "*" element={<div className='text-center text-3xl font-bold mt-40'>404 Not Found</div>} />
      </Routes>

      <ToastContainer 
        position="bottom-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App

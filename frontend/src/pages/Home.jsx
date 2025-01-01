// import React from 'react'
import { useEffect, useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReactLoading from 'react-loading';
import { motion } from "motion/react";
import ProfileComponent from "../components/ProfileComponent";
import {useParams} from 'react-router-dom';
import axios from "axios";
import PageNotFound from "./PageNotFound"

const Home = () => {
  const { username } = useParams();

  const { authUser, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false)
  const [isValidUsername, setIsValidUsername] = useState(true)
  const navigate = useNavigate();

  const { checkAuth, setSelectedUser } = useAuthStore();

  useEffect(() => {
    (async () => {
      try{
        if(username != undefined){
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/isvalidusername`, { params: { username } })
          setIsValidUsername(true)
          setSelectedUser(response.data.user)
        }
      } catch (error) {
        setIsValidUsername(false)
      }
    })();
  }, [setSelectedUser, username])

  useEffect(() => {
    checkAuth(setIsLoading, navigate, '', '/signup')
  }, [checkAuth, navigate])

  if(!isValidUsername && username) return <PageNotFound />

  return (
    <>
      {isLoading &&
        <ReactLoading
          type={"bubbles"}
          color={"#86ad8a"}
          height={"64px"}
          width={"64px"}
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10"
        />
      }
      <motion.div
        className={`${isLoading ? "pointer-events-none" : "pointer-events-auto"}`}
        initial={{ filter: 'blur(0px)' }}
        animate={{ filter: isLoading ? 'blur(1.5px)' : 'blur(0px)' }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        
        <div className="max-w-[1200px] m-auto p-5 flex">
          <ProfileComponent />

          <div className="w-full bg-lime-700">
            hello
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Home

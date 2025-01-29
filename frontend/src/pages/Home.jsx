// import React from 'react'
import { useEffect, useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ReactLoading from 'react-loading';
import ProfileComponent from "../components/ProfileComponent";
import PageNotFound from "./PageNotFound"
import ProfileShowReposComponent from "../components/ProfileShowReposComponent";
import Repositories from "../components/Repositories";
import ProfileSettings from "../components/ProfileSettings";

import { motion } from "motion/react";
import { useParams, useLocation } from 'react-router-dom';
import axios from "axios";

const Home = () => {
  const { username } = useParams();
  const location = useLocation();

  const [tab, setTab] = useState("");

  const [isLoading, setIsLoading] = useState(false)
  const [isValidUsername, setIsValidUsername] = useState(true)
  const navigate = useNavigate();

  const { checkAuth, setSelectedUser, setFollowersFollowings, authUser, selectedUser } = useAuthStore();

  useEffect(() => {
    (async () => {
      try{
        if(username != undefined){
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/isvalidusername`, { params: { username } })
          setIsValidUsername(true)
          setSelectedUser(response.data.user)
          setFollowersFollowings()
        }
      } catch (error) {
        setIsValidUsername(false)
      }
    })();
  }, [setSelectedUser, username])

  useEffect(() => {
    checkAuth(setIsLoading, navigate, `${location.pathname}${location.search}`, '/signup')
  }, [checkAuth, navigate])

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    const tab = url.get("tab");
    if (tab) {
      setTab(tab);
    } else{
      setTab('')
    }
  }, [location])
  

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
        <Navbar isRepoPage={false}/>
        
        <div className="max-w-[1200px] m-auto p-5 flex">
          <ProfileComponent />

          <div className="w-full">
            {tab == "repositires" && <Repositories />}
            {( tab == "settings" && authUser?.username == selectedUser?.username ) && <ProfileSettings />}
            {tab == "" && <ProfileShowReposComponent />}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Home

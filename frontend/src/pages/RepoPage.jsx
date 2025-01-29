import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import MonacoEditor from 'react-monaco-editor';

import { useAuthStore } from '../store/useAuthStore'
import Navbar from '../components/Navbar'
import PageNotFound from './PageNotFound';
import FileTree from '../components/FileTree';

import ReactLoading from 'react-loading'
import { motion } from 'framer-motion'
import axios from 'axios'

const RepoPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false)
    const [isValidUsername, setIsValidUsername] = useState(true)

    const { checkAuth, setSelectedUser } = useAuthStore();

    useEffect(() => {
        checkAuth(setIsLoading, navigate, '', '/signup')
    }, [checkAuth, navigate])

    useEffect(() => {
        (async () => {
            try {
                if (username != undefined) {
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/isvalidusername`, { params: { username } })
                    setIsValidUsername(true)
                    setSelectedUser(response.data.user)
                }
            } catch (error) {
                setIsValidUsername(false)
            }
        })();
    }, [setSelectedUser, username])

    // const { username, reponame } = useParams()
    // console.log(username, reponame)

    const editorOpetions = {
        wordWrap: 'on'
    }

    if (!isValidUsername && username) return <PageNotFound />

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
                className={`${isLoading ? "pointer-events-none" : "pointer-events-auto"} bg-red-400 h-screen flex flex-col`}
                initial={{ filter: 'blur(0px)' }}
                animate={{ filter: isLoading ? 'blur(1.5px)' : 'blur(0px)' }}
                transition={{ duration: 0.5 }}
            >
                <div className='sticky top-0 z-10'>
                    <Navbar isRepoPage={true} />
                </div>

                <div className="max-w-[1200px] m-auto p-5 h-full flex gap-5 ">
                    <div className='w-[300px]'>
                        <h1>RepoPage</h1>
                        <FileTree className="w-full"/>
                    </div>

                    <div className="w-full bg-lime-700 flex flex-col h-full">
                        <div>Hader</div>
                        {/* <MonacoEditor
                            className="h-full"
                            width="100%"
                            height="100"
                            language={"javascript"}
                            theme="vs-dark"
                            // value={code}
                            options={editorOpetions}
                            // onChange={::this.onChange}
                            // editorDidMount={::this.editorDidMount}
                        /> */}
                        <div>footer</div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default RepoPage
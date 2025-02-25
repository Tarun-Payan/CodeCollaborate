import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material'
import axios from 'axios';
import ReactLoading from 'react-loading'
import RepoPermissionModal from '../modals/RepoPermissionModal';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from "react-router-dom";

const RepoSettings = ({ reponame, repotype, setRepotype }) => {
  const { repoPermissions, setRepoPermissions } = useAuthStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)

  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const closePermissionModal = () => setShowPermissionModal(false)

  const [repoModalRequirement, setRepoModalRequirement] = useState({ type: "", permission: {} })

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        await setRepoPermissions(reponame)
        // console.log(response.data)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    })();
  }, [reponame])

  const handleDeletePemrission = async (element) => {
    if (window.confirm(`Delete permission?\nUsername: ${element.username}\nBranch: ${element.branch == "" ? "All" : element.branch}\nAccess: ${element.access === "RW+" ? "Full" : element.access === "RW" ? "Read & Write" : element.access === "R" && "Read"}`)) {
      try {
        setIsLoading(true)
        // console.log(pickedUser, branch, access)
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/repo/updateRepoPermission`, { reponame: reponame, permission: { username: element.username, access: element.access, branch: element.branch }, type: "delete" }, { withCredentials: true })

        setRepoPermissions(reponame)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChangeVisibility = async () => {
    if (window.confirm(`Do you want to change the visibility of the repository?\n${repotype} to ${repotype == "Public" ? "Private" : "Public"}`)) {
      try {
        setIsLoading(true)
        // console.log(pickedUser, branch, access)
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/repo/changeRepoVisibility`, { reponame: reponame, repotype }, { withCredentials: true })

        setRepotype(repotype == "Public" ? "Private" : "Public")
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteRepo = async () => {
    if (window.confirm("Do you want to delete the repository?")) {
      try {
        setIsLoading(true)
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/repo/delete-repo`, {
          reponame: reponame
        }, { withCredentials: true })
        
        navigate('/')
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

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
        <div className={`${isLoading ? "pointer-events-none" : "pointer-events-auto"} max-w-[1200px] m-auto`}>
          <div className='border-[1px] border-gray-400 p-2 mt-2 rounded-md'>
            <div className='flex justify-between w-[95%] m-auto items-center mb-4'>
              <h1 className='text-2xl font-semibold text-gray-600'>Manage Permission</h1>
              <Button variant="outlined" size="small"
                onClick={() => {
                  setRepoModalRequirement({ type: "add", permission: {} })
                  setShowPermissionModal(true)
                }}
              >Add</Button>
              {showPermissionModal && <RepoPermissionModal closeModal={closePermissionModal} {...repoModalRequirement} />}
            </div>

            <div className="relative overflow-x-auto w-[95%] m-auto bg-[#adc1d3] rounded-md my-2">
              <table className="w-full text-min-[632px] text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 bg-green-50 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Member name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Branch
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Access
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='text-[#343434]'>
                  {repoPermissions.map((element) => {
                    return (
                      <tr key={element.username} className="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-[#92b1cd]">
                        <td className="px-6 py-4 cursor-pointer flex items-center">{element.username}</td>
                        <td className="px-6 py-4">{element.branch == "" ? "All" : element.branch}</td>
                        <td className="px-6 py-4">{element.access == "RW+" && "Full"}{element.access == "RW" && "Read & Write"}{element.access == "R" && "Read"}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <span
                          // onClick={() => { handleEdit(item.id) }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/gwlusjdu.json"
                              trigger="hover"
                              style={{ "width": "20px", "height": "20px" }}
                              onClick={() => {
                                setRepoModalRequirement({ type: "update", permission: element })
                                setShowPermissionModal(true)
                              }}>
                            </lord-icon>
                          </span>
                          <span onClick={() => handleDeletePemrission(element)}>
                            <lord-icon
                              src="https://cdn.lordicon.com/skkahier.json"
                              trigger="hover"
                              style={{ "width": "20px", "height": "20px" }}>
                            </lord-icon>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className='border-[1px] border-gray-400 py-2 mt-2 rounded-md'>
            <h1 className='text-2xl font-semibold text-gray-600 px-2 mb-4 w-[95%] m-auto'>Danger Zone</h1>

            <div className='w-full h-[1px] bg-gray-400'></div>

            <div className='p-2 w-[95%] m-auto flex justify-between items-center'>
              <div>
                <p className='text-base text-[#1f2328] font-semibold'>Change repository visibility</p>
                <p className='text-base text-[#1f2328]'>This repository is currently {repotype}.</p>
              </div>

              <Button variant="outlined" color="error" size="small" onClick={() => handleChangeVisibility()}>Change visibility</Button>
            </div>

            <div className='w-full h-[1px] bg-gray-400'></div>

            <div className='p-2 w-[95%] m-auto flex justify-between items-center'>
              <div>
                <p className='text-base text-[#1f2328] font-semibold'>Delete this repository</p>
                <p className='text-base text-[#1f2328]'>Once you delete a repository, there is no going back. Please be certain.</p>
              </div>

              <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteRepo()}>Delete Repo</Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  export default RepoSettings

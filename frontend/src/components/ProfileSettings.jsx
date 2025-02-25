import { useState, useEffect } from "react"
import { Pencil, Plus } from "lucide-react"
import { motion } from "motion/react"
import axios from "axios"
import ReactLoading from 'react-loading';
import { Loader } from 'lucide-react'

const ProfileSettings = () => {
  const [sshKey, setSshKey] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [editSshKey, setEditSshKey] = useState('')
  const [isLoadingSaveBtn, setIsLoadingSaveBtn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/getSshKey`, { withCredentials: true })
        setSshKey(response.data.SSHKey)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])


  const handleEdit = () => {
    setIsEdit(true)
    setEditSshKey(sshKey)
  }

  const handleSave = async () => {
    try {
      setIsLoadingSaveBtn(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/repo/changeSSHKey`, { newSSHKey: editSshKey }, { withCredentials: true })
      setSshKey(editSshKey)
      setIsEdit(false)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoadingSaveBtn(false)
    }
  }

  return (
    <>
      {isLoading &&
        <>
        <div>loading</div>
        <ReactLoading
          type={"bubbles"}
          color={"#86ad8a"}
          height={"64px"}
          width={"64px"}
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10"
        />
        </>
      }
      <div className={`border p-2 m-2 ${isLoading ? "pointer-events-none" : "pointer-events-auto"}`}>
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">SSH key</h1>
          <div className={`${isEdit ? "pointer-events-none" : "pointer-events-auto cursor-pointer"}`} onClick={handleEdit}>
            {sshKey == '' ? <Plus size={18} strokeWidth={1.75} /> : <Pencil size={18} strokeWidth={1.75} />}
          </div>
        </div>

        <div className="h-[1px] w-full px-2 my-2 bg-gray-200"></div>

        {isEdit ?
          <div>
            <input type="text" className="border w-full outline-none px-2 text-sm py-1 focus:border-green-300 rounded-[4px]" placeholder="Enter SSH key" value={editSshKey} onChange={(e) => setEditSshKey(e.target.value)} />

            <div className="flex gap-2 mt-2">
              <motion.button
                className="bg-blue-400 text-white rounded-md px-2 py-[2px] hover:bg-blue-500 flex items-center justify-center gap-1 w-[80px]"
                whileHover={{
                  scale: 1.03
                }}
                whileTap={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => {
                  setIsEdit(false)
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="bg-blue-400 text-white rounded-md px-2 py-[2px] hover:bg-blue-500 flex items-center justify-center gap-1 w-[80px]"
                whileHover={{
                  scale: 1.03
                }}
                whileTap={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={handleSave}
              >
                { isLoadingSaveBtn ? <Loader size={18} strokeWidth={1.75} className='animate-spin m-auto' /> : "Save"}
              </motion.button>
            </div>
          </div>
          :
          <p className="text-sm text-gray-600">{sshKey != '' ? sshKey : 'No SSH key added'}</p>
        }
      </div>
    </>
  )
}

export default ProfileSettings

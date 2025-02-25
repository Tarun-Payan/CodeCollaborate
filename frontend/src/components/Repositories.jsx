import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { CalendarPlus2 } from "lucide-react"
import { motion } from "motion/react"
import { IoIosGitBranch } from "react-icons/io";
import CreateRepoModal from '../modals/CreateRepoModal';
import { Link } from 'react-router-dom';

const Repositories = () => {
  const { selectedUser, authUser } = useAuthStore();

  const [repositories, setRepositories] = useState([]);
  const [search, setSearch] = useState('');
  const [isNewRepoCreated, setIsNewRepoCreated] = useState(false);

  const [showCreateRepoModal, setShowCreateRepoModal] = useState(false)
  const closeCreateRepoModal = () => setShowCreateRepoModal(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/get-repos-data`, { params: { suser: selectedUser?.username }, withCredentials: true });
        // console.log(response.data)
        setRepositories(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        if(isNewRepoCreated) setIsNewRepoCreated(false)
      }
    })();
  }, [selectedUser, isNewRepoCreated])

  const RepoComponent = ({ repo }) => {
    return (
      <div className="flex px-2">
        <div className="flex flex-col items-center">
          <div className="p-2 rounded-full border bg-[#dfdfdf]">
            <IoIosGitBranch size={20} className="bg-blue-200 rounded-full" />
          </div>
          <div className="w-[1px] h-full bg-slate-300 relative top-0"></div>
        </div>

        <div className="pb-14">
          <p className="repo-name font-semibold text-[#4c4cb9] py-[7px] px-2"><Link to={`/${selectedUser?.username}/${repo.name}`} className="cursor-pointer hover:underline">{repo.name}</Link> <span className="text-xs border rounded-full px-2 py-1 text-blue-500 bg-green-200">{repo.type}</span></p>
          <p className="repo-description px-2 text-sm text-slate-500">{repo.description}</p>
        </div>
      </div>
    )
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  return (
    <div>
      <div className="Header flex justify-between mb-2">
        <input type="text" placeholder="Find a repository..." className="border-[1px] border-gray-400 outline-none focus:border-blue-400 rounded-md px-3 text-sm py-[2px]" onChange={handleSearch} />
        {selectedUser?.username == authUser?.username && <motion.button
          className="bg-blue-400 text-white rounded-md px-2 py-[2px] hover:bg-blue-500 flex items-center gap-1"
          whileHover={{
            scale: 1.03
          }}
          whileTap={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => setShowCreateRepoModal(true)}
        >
          <CalendarPlus2 size={16} />New
        </motion.button>}
        {showCreateRepoModal && <CreateRepoModal closeModal={closeCreateRepoModal} setIsNewRepoCreated={setIsNewRepoCreated}/>}
      </div>

      {repositories?.repos?.length > 0 ?
        repositories?.repos.filter(repo => repo.name.toLowerCase().indexOf(search.toLowerCase()) > -1).map(repo => <RepoComponent key={repo._id} repo={repo} />)
        : <div className='text-center text-gray-400 text-base'>No repositories found</div>
      }
    </div>
  )
}

export default Repositories

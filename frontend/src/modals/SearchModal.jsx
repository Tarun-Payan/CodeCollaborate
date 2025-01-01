import OuterModal from './OuterModal'
import { X } from 'lucide-react'
import { Search } from "lucide-react"
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const SearchModal = ({ closeModal }) => {
    const [search, setsearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const modalHeader = useRef() // Ref for the target div
    const [divHeight, setDivHeight] = useState(0); // State to store the height

    useEffect(() => {
        // Update the height after component mounts or updates
        if (modalHeader.current) {
            setDivHeight(modalHeader.current.offsetHeight); // Get the height of the div
        }
    }, []); // Empty dependency array ensures it runs once after initial render

    useEffect(() => {
        if (!search) {
            setSearchResults([])
            return;
        }

        const delayDebounce = setTimeout(async () => {
            // check username is available or not in database
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/users/search-users`, { params: { query: search } }, { withCredentials: true })
                setSearchResults(response.data)
            } catch (error) {
                return;
            }
        }, 1000)

        return () => clearTimeout(delayDebounce);
    }, [search])

    const ShowSearchData = () => {
        if (searchResults.length == 0) return <p className='w-full flex justify-center'>No search results found</p>
        return searchResults.map((user, index) => {
            const name = splitIntoThreeParts(user.name, search)
            const username = splitIntoThreeParts(user.username, search)

            return <Link to={`/${user.username}`} key={index} className='px-3 py-2 hover:bg-slate-100 flex items-center cursor-pointer' onClick={closeModal}>
                <Search className='size-4 text-gray-400' />
                <div className='pl-3 text-sm'>
                    <p className='text-gray-800 leading-3'>
                        {name[0]}
                        <span className='text-gray-950 font-semibold underline'>{name[1]}</span>
                        {name[2]}
                    </p>
                    <p className='text-gray-400'>
                        {username[0]}
                        <span className='text-gray-500 font-semibold underline'>{username[1]}</span>
                        {username[2]}
                    </p>
                </div>
            </Link>
        })
    }

    function splitIntoThreeParts(input, delimiter) {
        const lowerInput = input.toLowerCase();
        const lowerDelimiter = delimiter.toLowerCase();
        const index = lowerInput.indexOf(lowerDelimiter);
        if (index === -1) {
            // If the delimiter is not found, return the entire input as the first part and the others as empty
            return [input, '', ''];
        }
        const before = input.substring(0, index);
        const match = input.substring(index, index + delimiter.length);
        const after = input.substring(index + delimiter.length);
        return [before, match, after];
    }

    return (
        <OuterModal closeModal={closeModal}>
            <div ref={modalHeader} className='ModalHeader py-2 px-3 relative w-full flex'>
                <div className='relative w-full'>
                    <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none'>
                        <Search className='size-4 text-gray-400' />
                    </div>
                    <input
                        value={search}
                        onChange={(e) => setsearch(e.target.value)}
                        type="text"
                        placeholder='Search'
                        className='w-full pl-7 py-1 bg-transparent bg-opacity-50 rounded-lg border-none outline-none text-gray-900 text-sm placeholder-gray-400 transition duration-200'
                    />
                </div>

                <button type="button" className="close" onClick={closeModal}>
                    <X />
                </button>
            </div>

            <div className='h-[1px] w-full bg-gray-300'></div>

            {/* Search Results */}
            <div
                className='overflow-y-auto scrollbar-none'
                style={{ height: `calc(499px - ${divHeight}px)` }}
            >
                <ShowSearchData />
            </div>
        </OuterModal>
    )
}

export default SearchModal

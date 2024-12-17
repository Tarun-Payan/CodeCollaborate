import { motion } from "motion/react"
import ReactLoading from 'react-loading';

const LoginSignupOuterComponent = ({children, isLoading}) => {
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
            className={`bg-gradient-to-b from-slate-700 to-zinc-900 min-h-[100vh] min-w-[100vw] flex flex-col justify-center items-center px-3 ${isLoading ? "pointer-events-none" : "pointer-events-auto"}`}
            initial={{ filter: 'blur(0px)' }}
            animate={{ filter: isLoading ? 'blur(1.5px)' : 'blur(0px)' }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    </>
  )
}

export default LoginSignupOuterComponent

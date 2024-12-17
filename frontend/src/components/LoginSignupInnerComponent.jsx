import { motion } from "motion/react"

const LoginSignupInnerComponent = ({ className: cname, children }) => {
    return (
        <motion.div
            className={`bg-[#0c162d] text-[#8193b2] rounded-md min-[540px]:w-[500px] w-full ${cname}`}
            // initial={{ opacity: 0, y: 20 }} // Starting animation
            // animate={{ opacity: 1, y: 0 }}   // While in view
            // transition={{ duration: 0.5, delay: 0.5 }}
            initial={{ 
                opacity: 0,
                y: 20, 
                scale: 0.9,
                filter: 'blur(4px)'
            }}
            animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                filter: 'blur(0px)',
                transition: { delay: 0.3, duration: 1 }
            }}
        >
            {children}
        </motion.div>
    )
}

export default LoginSignupInnerComponent

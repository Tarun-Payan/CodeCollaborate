import Navbar from "../landingPageComponents/Navbar";
import HeroSection from "../landingPageComponents/HeroSection";
// import FeatureSection from "./components/FeatureSection";
import Workflow from "../landingPageComponents/Workflow";
import Footer from "../landingPageComponents/Footer";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from 'react-loading';

const LandingPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { checkAuth } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth(setIsLoading, navigate, '/', '')
    }, [checkAuth, navigate])

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
            <div className="bg-[#121212]">
                <Navbar />
                <div className="max-w-7xl mx-auto pt-20 px-6 bg-[#121212]">
                    <HeroSection />
                    {/* <FeatureSection /> */}
                    <Workflow />
                    {/* <Pricing /> */}
                    {/* <Testimonials /> */}
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default LandingPage

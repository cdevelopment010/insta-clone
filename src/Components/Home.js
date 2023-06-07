
import { useState, useEffect } from "react"
import Avatar from "./Avatar"
import Menu from "./Menu";
import Post from "./Post";

import '../Styles/home.css';

export default function Home() {

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.innerWidth > 768 ? false : true);
        window.addEventListener("resize",checkMobile)
        return () => window.removeEventListener("resize", checkMobile);
    })

    function checkMobile() {
        setIsMobile(window.innerWidth > 768 ? false : true); 
    }

    if (isMobile){
        return (
            <div className="mobile-container">
                <div className="mobile-nav-header"></div>
                <div className="content">
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />  
                </div>
                <div className="mobile-nav-footer">
                    <ul className="d-flex align-items-center justify-content-evenly h-100">
                        <li className="menu-item"><img src="/Icons/svg/home-solid.svg" alt=""/></li>
                        <li className="menu-item"><img src="/Icons/svg/search-regular.svg" alt=""/></li>
                        <li className="menu-item"><img src="/Icons/svg/instagram-reels-regular.svg" alt=""/></li>
                        <li className="menu-item"><img src="/Icons/svg/instagram-share-regular.svg" alt=""/></li>
                        <li className="menu-item"><Avatar /></li>
                    </ul>
                </div>
            </div>
        )

    } else {
        return (
            <div className="desktop-container">
                <Menu/>
                <div className="content">
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                </div>
            </div>
        )
    }
}
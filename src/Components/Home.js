
import { useState, useEffect } from "react"
import Avatar from "./Avatar"
import Menu from "./Menu";
import Post from "./Post";

import '../Styles/home.css';

/* SVG ICONS */
import {ReactComponent as HomeSolid} from '../Icons/svg/home-solid.svg';
import {ReactComponent as HomeSvg} from '../Icons/svg/home-regular.svg';
import {ReactComponent as HeartSolid} from '../Icons/svg/heart-solid.svg';
import {ReactComponent as HeartSvg} from '../Icons/svg/heart-regular.svg';
import {ReactComponent as SearchSolid} from '../Icons/svg/search-solid.svg';
import {ReactComponent as SearchSvg} from '../Icons/svg/search-regular.svg';
import {ReactComponent as CompassSolid} from '../Icons/svg/compass-north-solid.svg';
import {ReactComponent as CompassSvg} from '../Icons/svg/compass-north-regular.svg';
import {ReactComponent as ReelsSolid} from '../Icons/svg/instagram-reels-solid.svg';
import {ReactComponent as ReelsSvg} from '../Icons/svg/instagram-reels-regular.svg';
import {ReactComponent as ShareSolid} from '../Icons/svg/instagram-share-solid.svg';
import {ReactComponent as ShareSvg} from '../Icons/svg/instagram-share-regular.svg';
import {ReactComponent as AddSolid} from '../Icons/svg/add-button-solid.svg';
import {ReactComponent as AddSvg} from '../Icons/svg/add-button-regular.svg';

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

    const [currentMenuItem, setCurrentMenuItem] = useState("home");
    function findAncestorElement(element, targetTagName) {
        var parentElement = element.parentNode;
      
        if (!parentElement) {
          return null; // Reached the top of the DOM hierarchy, target not found
        }
      
        if (parentElement.tagName.toLowerCase() === targetTagName.toLowerCase()) {
          return parentElement; // Found the target element
        }
      
        return findAncestorElement(parentElement, targetTagName); // Recursively move up the DOM
      }

    function changeToSolid(e) {
        e.stopPropagation();
        e.preventDefault();
        let el;
        if (e.target.tagName.toLowerCase() !== "a") {
            el = findAncestorElement(e.target,"a");
        } else {
            el = e.target;
        }
        setCurrentMenuItem(el.id);
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
                        <li className="menu-item">
                        <a href="#" className={`d-flex align-items-center ${currentMenuItem=="home" ? 'bold' : ''}`} onClick={changeToSolid} id="home">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="home"
                                        &&
                                        <HomeSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem != "home"
                                        &&
                                        <HomeSvg height="25" width="25"/>
                                    }
                                </svg>
                            </a>    
                        </li>
                        <li className="menu-item">
                        <a href="#" className={`d-flex align-items-center ${currentMenuItem=="search" ? 'bold' : ''}`} onClick={changeToSolid} id="search">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="search" 
                                        && <SearchSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="search" 
                                        && <SearchSvg height="25" width="25"/>
                                    }
                                </svg>
                            </a>
                        </li>
                        <li className="menu-item">
                        <a href="#" className={`d-flex align-items-center ${currentMenuItem=="reels" ? 'bold' : ''}`} onClick={changeToSolid} id="reels">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="reels" 
                                        && <ReelsSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="reels" 
                                        && <ReelsSvg height="25" width="25"/>
                                    }
                                </svg>
                            </a>
                        </li>
                        <li className="menu-item">
                        <a href="#" className={`d-flex align-items-center ${currentMenuItem=="share" ? 'bold' : ''}`} onClick={changeToSolid} id="share">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="share" 
                                        && <ShareSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="share" 
                                        && <ShareSvg height="25" width="25"/>
                                    }
                                </svg>
                            </a>
                        </li>
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
import Avatar from './Avatar';
import Firebase from "../Firebase";
import { signOut } from "firebase/auth";

import '../Styles/menu.css';

/* SVG ICONS */
import {ReactComponent as HomeSolid} from '../Icons/svg/home-solid.svg';
import {ReactComponent as HomeSvg} from '../Icons/svg/home-regular.svg';
import {ReactComponent as SearchSolid} from '../Icons/svg/search-solid.svg';
import {ReactComponent as SearchSvg} from '../Icons/svg/search-regular.svg';
import {ReactComponent as AddSolid} from '../Icons/svg/add-button-solid.svg';
import {ReactComponent as AddSvg} from '../Icons/svg/add-button-regular.svg';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Menu({showCreate, children, currentUser}) {

    const [currentMenuItem, setCurrentMenuItem] = useState("home");
    const [user, setUser] = useState(currentUser);
  
    useEffect(() => {
        setUser(currentUser);
    },[currentUser])

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
        let el;
        if (e.target.tagName.toLowerCase() !== "span") {
            el = findAncestorElement(e.target,"span");
        } else {
            el = e.target;
        }
        setCurrentMenuItem(el.id);
    }

    const logout = async () => {
        try {
            await signOut(Firebase.auth);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="menu container">

        <div className="mobile-container">
        <div className="mobile-container">
                <div className="mobile-nav-header d-flex align-items-center justify-content-between">
                    <h2 className="logo">Instagram</h2>


                    <Link to="/home">
                        <span className={`d-flex align-items-center ${currentMenuItem==="add" ? 'bold' : ''}`} onClick={(e) => {changeToSolid(e); showCreate()}} id="add">
                            <svg height="25" width="25" className="svg-icon me-2" >
                                {currentMenuItem==="add" 
                                    && <AddSolid height="25" width="25"/>
                                }
                                {currentMenuItem!=="add" 
                                    && <AddSvg height="25" width="25"/>
                                }
                            </svg>
                        </span>
                    </Link>
                </div>
                <div className="content">
                    {children}
                </div>
                <div className="mobile-nav-footer">
                    <ul className="d-flex align-items-center justify-content-evenly h-100">
                        <li className="menu-item">
                            <Link to="/home">
                            <span className={`d-flex align-items-center ${currentMenuItem==="home" ? 'bold' : ''}`} onClick={changeToSolid} id="home">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem==="home"
                                        &&
                                        <HomeSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem !== "home"
                                        &&
                                        <HomeSvg height="25" width="25"/>
                                    }
                                </svg>
                            </span>   
                            </Link> 
                        </li>
                        <li className="menu-item">
                            <Link to="/search/">
                                <span className={`d-flex align-items-center ${currentMenuItem==="search" ? 'bold' : ''}`} onClick={changeToSolid} id="search">
                                    <svg height="25" width="25" className="svg-icon me-2" >
                                        {currentMenuItem==="search" 
                                            && <SearchSolid height="25" width="25"/>
                                        }
                                        {currentMenuItem!=="search" 
                                            && <SearchSvg height="25" width="25"/>
                                        }
                                    </svg>
                                </span>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/profile">
                                <Avatar className="me-2" src={user?.profileImgUrl?.length > 0 ? user?.profileImgUrl[0] : ""}/>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <div className="menu-desktop-container">
        <div className="menu-container d-flex flex-column justify-content-between align-items-stretch">
            <div>
                <div className="logo">Instagram Clone</div>
                <div className="d-flex align-items-start justify-content-evenly flex-column menu-items-container">
                    <ul className="d-flex align-items-start justify-content-evenly flex-column menu-list">
                        <li className="d-flex align-items-center menu-item">
                            <Link to="/home">
                            <span  className={`d-flex align-items-center ${currentMenuItem==="home" ? 'bold' : ''}`} onClick={changeToSolid} id="home">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem==="home"
                                        &&
                                        <HomeSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem !== "home"
                                        &&
                                        <HomeSvg height="25" width="25"/>
                                    }
                                </svg>
                                Home
                            </span></Link></li>
                        <li className="d-flex align-items-center menu-item">
                            <Link to="/Search/">
                            <span className={`d-flex align-items-center ${currentMenuItem==="search" ? 'bold' : ''}`} onClick={changeToSolid} id="search">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem==="search" 
                                        && <SearchSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!=="search" 
                                        && <SearchSvg height="25" width="25"/>
                                    }
                                </svg>
                                Search
                            </span>
                            </Link>
                        </li>
                        <li className={`d-flex align-items-center menu-item ${user ? '' : 'd-none'}`}>
                            <Link to="/home">
                            <span className={`d-flex align-items-center ${currentMenuItem==="add" ? 'bold' : ''}`} onClick={(e) => {changeToSolid(e); showCreate()}} id="add">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem==="add" 
                                        && <AddSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!=="add" 
                                        && <AddSvg height="25" width="25"/>
                                    }
                                </svg>
                                Create
                            </span>
                            </Link>
                        </li>
                        {Firebase.auth.currentUser != null &&

                            <li className="d-flex align-items-center menu-item">
                                <Link to="/profile" className={`d-flex align-items-center ${currentMenuItem==="avatar" ? 'bold' : ''}`} id="avatar">
                                    <span className={`d-flex align-items-center ${currentMenuItem==="profile" ? 'bold' : ''}`} onClick={(e) => {changeToSolid(e)}} id="profile">
                                        <Avatar className="me-2" src={user?.profileImgUrl?.length > 0 ? user?.profileImgUrl[0] : ""} userid=""/>
                                        Profile
                                    </span>
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <div className="menu-footer">
                <Link to="/" className="logo-out"><span onClick={logout} className="">Logo out</span></Link>
            </div>

        </div>
            {children}
        </div>
        </div>
    )
}
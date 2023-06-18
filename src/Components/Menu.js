import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse as faHouseSolid, faMagnifyingGlass, faBars, faCompass as faCompassSolid  } from "@fortawesome/free-solid-svg-icons"

import Avatar from './Avatar';
import Firebase from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where} from "firebase/firestore";


import '../Styles/menu.css';

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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Menu({showCreate}) {

    const [currentMenuItem, setCurrentMenuItem] = useState("home");
    const [imgUrl, setImgUrl] = useState("");
    const [user, setUser] = useState(null);

    const userCollectionRef = collection(Firebase.db,"users");

    useEffect(() => {
        

    }, [])

    //this didn't have a dependency -- might have been the issue causing a lot of reads!!!
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Firebase.auth, (user) => {
            if (user) {
              getData(); 
            } else {
                
            }
        });
        
        let profileUrl = currentUser();
        setImgUrl(profileUrl?.photoURL); 
        const getData = async () => {
            let authUid = Firebase?.auth?.currentUser?.uid || null;
            const userData = query(userCollectionRef, where("userid", "==", authUid));
            const querySnapshop = await getDocs(userData);
            querySnapshop.forEach((doc) => {
                const data = {...doc.data(), id: doc.id};
                setUser(data);  
            })
        }
  
        return () => unsubscribe(); 
    },[])

    function currentUser() {
        let user = Firebase?.auth?.currentUser;
        // console.log(user);
        return user;
    }

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

    //desktop version
    return (
        <div className="menu-container d-flex flex-column justify-content-between align-items-stretch">
            <div>
                <div className="logo">Logo desktop...</div>
                <div className="d-flex align-items-start justify-content-evenly flex-column menu-items-container">
                    <ul className="d-flex align-items-start justify-content-evenly flex-column menu-list">
                        <li className="d-flex align-items-center menu-item">
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
                                Home
                            </a></li>
                        <li className="d-flex align-items-center menu-item">
                            <a href="#" className={`d-flex align-items-center ${currentMenuItem=="search" ? 'bold' : ''}`} onClick={changeToSolid} id="search">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="search" 
                                        && <SearchSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="search" 
                                        && <SearchSvg height="25" width="25"/>
                                    }
                                </svg>
                                Search
                            </a>
                        </li>
                        <li className="d-flex align-items-center menu-item">
                            <a href="#" className={`d-flex align-items-center ${currentMenuItem=="explore" ? 'bold' : ''}`} onClick={changeToSolid} id="explore">
                                <svg height="25" width="25" className="svg-icon compass me-2" >
                                    {currentMenuItem=="explore" 
                                        && <CompassSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="explore" 
                                        && <CompassSvg height="25" width="25"/>
                                    }
                                </svg>
                                Explore
                            </a>
                        </li>
                        <li className="d-flex align-items-center menu-item">
                            <a href="#" className={`d-flex align-items-center ${currentMenuItem=="reels" ? 'bold' : ''}`} onClick={changeToSolid} id="reels">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="reels" 
                                        && <ReelsSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="reels" 
                                        && <ReelsSvg height="25" width="25"/>
                                    }
                                </svg>
                                
                                Reels
                            </a>
                        </li>
                        <li className="d-flex align-items-center menu-item">
                            <a href="#" className={`d-flex align-items-center ${currentMenuItem=="share" ? 'bold' : ''}`} onClick={changeToSolid} id="share">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="share" 
                                        && <ShareSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="share" 
                                        && <ShareSvg height="25" width="25"/>
                                    }
                                </svg>
                                Messages
                            </a>
                        </li>
                        <li className="d-flex align-items-center menu-item">
                            <a href="#" className={`d-flex align-items-center ${currentMenuItem=="notifications" ? 'bold' : ''}`} onClick={changeToSolid} id="notifications">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="notifications" 
                                        && <HeartSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="notifications" 
                                        && <HeartSvg height="25" width="25"/>
                                    }
                                </svg>
                                Notifications
                            </a>
                        </li>
                        <li className="d-flex align-items-center menu-item">
                            <a href="#" className={`d-flex align-items-center ${currentMenuItem=="add" ? 'bold' : ''}`} onClick={(e) => {changeToSolid(e); showCreate()}} id="add">
                                <svg height="25" width="25" className="svg-icon me-2" >
                                    {currentMenuItem=="add" 
                                        && <AddSolid height="25" width="25"/>
                                    }
                                    {currentMenuItem!="add" 
                                        && <AddSvg height="25" width="25"/>
                                    }
                                </svg>
                                Create
                            </a>
                        </li>
                        {Firebase.auth.currentUser != null &&

                            <li className="d-flex align-items-center menu-item">
                                <Link to="/profile" className={`d-flex align-items-center ${currentMenuItem=="avatar" ? 'bold' : ''}`} id="avatar">
                                    <Avatar className="me-2" src={user?.profileImgUrl ? user?.profileImgUrl[0] : ""}/>
                                    Profile
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <div className="menu-footer">
                <FontAwesomeIcon icon= {faBars}  className="menu-item"/>
            </div>

        </div>
    )
}
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse as faHouseSolid, faMagnifyingGlass, faBars, faCompass as faCompassSolid  } from "@fortawesome/free-solid-svg-icons"

import Avatar from './Avatar';


import '../Styles/menu.css';

export default function Menu() {

    function changeToSolid(e) {
        console.log(e);
    }

    //desktop version
    return (
        <div className="menu-container d-flex flex-column justify-content-between align-items-start p-5">
            <div>
                <div className="mb-5 pb-5">Logo desktop...</div>
                <div className="d-flex align-items-start justify-content-evenly flex-column menu-items-container">
                    <ul className="d-flex align-items-start justify-content-evenly flex-column menu-list">
                        <li className="d-flex align-items-center"><img src="/Icons/svg/home-solid.svg" alt="" className="menu-item me-2" /> Home</li>
                        <li className="d-flex align-items-center"><img src="/Icons/svg/search-regular.svg" alt="" className="menu-item me-2" />Search</li>
                        <li className="d-flex align-items-center"><img src="/Icons/svg/compass-north.svg" alt="" className="menu-item me-2 compass" />Explore</li>
                        <li className="d-flex align-items-center"><img src="/Icons/svg/instagram-reels-regular.svg" alt="" className="menu-item me-2" />Reels</li>
                        <li className="d-flex align-items-center"><img src="/Icons/svg/instagram-share-regular.svg" alt="" className="menu-item me-2" />Messages</li>
                        <li className="d-flex align-items-center"><img src="/Icons/svg/heart-regular.svg" alt="" className="menu-item me-2" />Notifications</li>
                        <li className="d-flex align-items-center"><img src="/Icons/svg/add-button-regular.svg" alt="" className="menu-item me-2" />Create</li>
                        <li className="d-flex align-items-center"><Avatar className="menu-item me-2" />Profile</li>

                    </ul>
                </div>
            </div>
            <div>
                <FontAwesomeIcon icon= {faBars}  className="menu-item"/>
            </div>

        </div>
    )

    //mobile verion
    return (
        <div>
            <span>Logo...</span>

        </div>
    )
}
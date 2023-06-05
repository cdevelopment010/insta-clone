import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse as faHouseSolid, faMagnifyingGlass, faBars, faCompass as faCompassSolid  } from "@fortawesome/free-solid-svg-icons"

import Avatar from './Avatar';


import '../Styles/menu.css';

export default function Menu() {

    function changeToSolid(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log("test", e.target);

        [...document.getElementsByClassName('menu-item')].map(item => {
            let itemLink = item.querySelector('a');
            itemLink?.classList.remove('bold');
            if (item.querySelector('img')?.src) {
                item.querySelector('img').src = item.querySelector('img').src.replace('solid','regular');
            }
        }); 

        if (e.target.tagName.toLowerCase() === 'a') {
            e.target.classList.add('bold');
            if (e.target.children[0]?.src) {
                e.target.children[0].src= e.target.children[0].src.replace('regular','solid');
            }
        } else {
            e.target.parentElement.classList.add('bold');
            e.target.src= e.target.src.replace('regular','solid');
        }
    }

    //desktop version
    return (
        <div className="menu-container d-flex flex-column justify-content-between align-items-stretch">
            <div>
                <div className="logo">Logo desktop...</div>
                <div className="d-flex align-items-start justify-content-evenly flex-column menu-items-container">
                    <ul className="d-flex align-items-start justify-content-evenly flex-column menu-list">
                        <li className="d-flex align-items-center menu-item"><a href="#" className="d-flex align-items-center bold" onClick={changeToSolid}><img src="/Icons/svg/home-solid.svg" alt="" className=" me-2" /> Home</a></li>
                        <li className="d-flex align-items-center menu-item"><a href="#" className="d-flex align-items-center" onClick={changeToSolid}><img src="/Icons/svg/search-regular.svg" alt="" className="me-2" />Search</a></li>
                        <li className="d-flex align-items-center menu-item"><a href="#" className="d-flex align-items-center" onClick={changeToSolid}><img src="/Icons/svg/compass-north-regular.svg" alt="" className="me-2 compass" />Explore</a></li>
                        <li className="d-flex align-items-center menu-item"><a href="#" className="d-flex align-items-center" onClick={changeToSolid}><img src="/Icons/svg/instagram-reels-regular.svg" alt="" className="me-2" />Reels</a></li>
                        <li className="d-flex align-items-center menu-item"><a href="#" className="d-flex align-items-center" onClick={changeToSolid}><img src="/Icons/svg/instagram-share-regular.svg" alt="" className="me-2" />Messages</a></li>
                        <li className="d-flex align-items-center menu-item"><a href="#" className="d-flex align-items-center" onClick={changeToSolid}><img src="/Icons/svg/heart-regular.svg" alt="" className="me-2" />Notifications</a></li>
                        <li className="d-flex align-items-center menu-item"><a href="#" className="d-flex align-items-center" onClick={changeToSolid}><img src="/Icons/svg/add-button-regular.svg" alt="" className="me-2" />Create</a></li>
                        <li className="d-flex align-items-center menu-item"><a href="#" className="d-flex align-items-center" onClick={changeToSolid}><Avatar className="me-2" />Profile</a></li>

                    </ul>
                </div>
            </div>
            <div className="menu-footer">
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
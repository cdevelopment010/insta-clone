import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse as faHouseSolid, faMagnifyingGlass, faBars, faCompass as faCompassSolid  } from "@fortawesome/free-solid-svg-icons"
import { faCompass, faPaperPlane, faHeart, faPlusSquare  } from "@fortawesome/fontawesome-free-regular";


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
                    <ul>
                        <li><FontAwesomeIcon icon= {faHouseSolid} className="menu-item" /></li>
                        <li><FontAwesomeIcon icon= {faMagnifyingGlass}  className="menu-item" /></li>
                        <li><FontAwesomeIcon icon= {faCompass}  className="menu-item compass" onFocus={changeToSolid}/></li>
                        <li><img className="reels menu-item" src={process.env.PUBLIC_URL + '/images/instagram-reels-icon.svg'} alt="reels" /></li>
                        <li><FontAwesomeIcon icon= {faPaperPlane}  className="menu-item"/></li>
                        <li><FontAwesomeIcon icon= {faHeart}  className="menu-item"/></li>
                        <li><FontAwesomeIcon icon= {faPlusSquare}  className="menu-item"/></li>

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
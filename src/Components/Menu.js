import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faMagnifyingGlass, faBars  } from "@fortawesome/free-solid-svg-icons"
import { faCompass, faPaperPlane, faHeart, faPlusSquare  } from "@fortawesome/fontawesome-free-regular";


import '../Styles/menu.css';

export default function Menu() {

    //desktop version
    return (
        <div className="menu-container d-flex flex-column justify-content-between align-items-start p-5">
            <div>
                <div className="mb-5 pb-5">Logo desktop...</div>
                <div className="d-flex align-items-start justify-content-evenly flex-column menu-items-container">
                    <FontAwesomeIcon icon= {faHouse} className="menu-item"/>
                    <FontAwesomeIcon icon= {faMagnifyingGlass}  className="menu-item"/>
                    <FontAwesomeIcon icon= {faCompass}  className="menu-item"/>
                    <img className="reels menu-item" src={process.env.PUBLIC_URL + '/images/instagram-reels-icon.svg'} alt="reels" />
                    <FontAwesomeIcon icon= {faPaperPlane}  className="menu-item"/>
                    <FontAwesomeIcon icon= {faHeart}  className="menu-item"/>
                    <FontAwesomeIcon icon= {faPlusSquare}  className="menu-item"/>
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
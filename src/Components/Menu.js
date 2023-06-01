import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faMagnifyingGlass, faBars  } from "@fortawesome/free-solid-svg-icons"
import { faCompass, faPaperPlane, faHeart, faPlusSquare  } from "@fortawesome/fontawesome-free-regular";


import '../Styles/menu.css';

export default function Menu() {

    //desktop version
    return (
        <div>
            <span>Logo desktop...</span>
            <div className="d-flex align-items-center justify-content-evenly w-50">
                <FontAwesomeIcon icon= {faHouse} />
                <FontAwesomeIcon icon= {faMagnifyingGlass} />
                <FontAwesomeIcon icon= {faCompass} />
                <img className="reels" src={process.env.PUBLIC_URL + '/images/instagram-reels-icon.svg'} alt="reels" />
                <FontAwesomeIcon icon= {faPaperPlane} />
                <FontAwesomeIcon icon= {faHeart} />
                <FontAwesomeIcon icon= {faPlusSquare} />
                <FontAwesomeIcon icon= {faBars} />
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
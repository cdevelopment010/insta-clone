import '../Styles/avatar.css';
import { Link } from 'react-router-dom';

export default function Avatar({size =null, bg = null, src = "", className = "", userid=""}) {
    return (
        <div>
            {
                userid === "" &&
                <div className={`profile-pic ${size ? size : ''} ${className}`}>
                    {bg !== null && 
                        <div class="bg"></div>
                    }
                    <img src={src ? src : ""} referrerPolicy="no-referrer" />
                </div>  
            }

            {
                userid !== "" &&
                <Link to={`/profile/${userid}`}>
                    <div className={`profile-pic ${size ? size : ''} ${className}`}>
                        {bg !== null && 
                            <div class="bg"></div>
                        }
                        <img src={src ? src : ""} referrerPolicy="no-referrer" />
                    </div>    
                </Link>
            }
        </div>
    )
}
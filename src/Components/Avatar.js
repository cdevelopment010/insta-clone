import { useState, useEffect } from "react"
import '../Styles/avatar.css';

export default function Avatar({size =null, bg = null, src = "", className = ""}) {
    return (
        <div>
            <div className={`profile-pic ${size ? size : ''} ${className}`}>
                {bg !== null && 
                    <div class="bg"></div>
                }
                <img src={src ? src : ""} referrerPolicy="no-referrer" />
            </div>    
        </div>
    )
}
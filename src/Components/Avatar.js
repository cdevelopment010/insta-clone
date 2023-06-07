import { useState, useEffect } from "react"
import '../Styles/avatar.css';

export default function Avatar({size =null, bg = null, src = null, className = ""}) {

    useEffect(() => {

    }) 
    return (
        <div>
            <div className={`profile-pic ${size ? size : ''} ${className}`}>
                {bg !== null && 
                    <div class="bg"></div>
                }
                <img src={src ? src : ''} />
            </div>    
        </div>
    )
}
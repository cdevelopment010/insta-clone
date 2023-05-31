import { useState, useEffect } from "react"
import '../Styles/avatar.css';

export default function Avatar({size =null, bg = null, src = null}) {

    useEffect(() => {

    }) 
    return (
        <div>
            <div className={`profile-pic ${size ? size : ''} ${bg ? bg : ''}`}>
                <img src={src ? src : ''} />
            </div>    
        </div>
    )
}
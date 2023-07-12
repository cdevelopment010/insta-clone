
import styles from '../Styles/toast.module.css';

import { useEffect, useState } from 'react';

export default function Toast({type, timeout, message, visible, updateVisible}) {

    /*
        type: success, warning, danger
        timeout: ms
        message: string
    */

    const [visibleState, setVisibleState] = useState(visible);

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setVisibleState('invisible');
            updateVisible();
        }, timeout)
        return () => clearInterval(timeOut);
    },[])

    return(
        <div className={`${styles["toast-container"]} ${styles[visibleState]}`}>
            <div className={`${styles["toast"]} ${styles[type]}`}>
                <div className={styles["toast-message"]}>{message}</div>
            </div>
        </div>
    )
}
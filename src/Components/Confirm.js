
import styles from '../Styles/toast.module.css';

import { useEffect, useState } from 'react';

export default function Confirm({visible, updateVisible, options}) {

    /*
        options object like
        {
            message: ....,
            pCallback: () => {...}
        }
    */

    const [visibleState, setVisibleState] = useState(visible);

    useEffect(() => {
    },[])

    const cancelBtn = () => {
        setVisibleState(false);
        options.updateConfirmObj({
            visible: updateVisible(),
            pCallback: () => {}
        })
    }

    const okBtn = async () => {
        await options.pCallback();
        setVisibleState(false);
        options.updateConfirmObj({
            visible: updateVisible(),
            message: ' ',
            pCallback: () => {}
        })
    }

    return(
        <div className={`${styles["toast-container"]} ${styles[visibleState]}`}>
            <div className={`${styles["toast"]} ${styles["confirm"]} d-flex flex-column align-items-center justify-content-center`}>
                <div className={styles["toast-message"]}>{options.message ? options.message : ''}</div>
                <div className='d-flex align-items-center justify-content-end mt-3 align-self-bottom'>
                    <button className='m-2 cursor-pointer' onClick={cancelBtn}>Cancel</button>
                    <button className='m-2 bg-danger cursor-pointer' onClick={okBtn}>OK</button>
                </div>
            </div>
        </div>
    )
}
import { useEffect } from 'react';
import Menu from './Menu';
import Toast from './Toast';
import Confirm from './Confirm';
import styles from '../Styles/layout.module.css'

export default function Layout({children, showCreate, currentUser, toast, confirmObj}) {

    useEffect(()=> {
    }, [toast])
    useEffect(()=> {
    }, [confirmObj])

    return (
        <div className={styles["layout-container"]}>
            <Menu showCreate={showCreate} currentUser={currentUser}> 
                {children}
            </Menu>
            {
                toast.visible &&
                <Toast type={toast.type} timeout={toast.timeout} message={toast.message} updateVisible={toast.updateVisible}/>
            }
            {
                confirmObj.visible &&
                <Confirm visible={confirmObj.visible} updateVisible={confirmObj.updateVisible} options={confirmObj}/> 
            }
        </div>
    )
}
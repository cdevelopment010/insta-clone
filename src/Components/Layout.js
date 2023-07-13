import { useEffect } from 'react';
import Menu from './Menu';
import Toast from './Toast';

export default function Layout({children, showCreate, currentUser, toast}) {

    useEffect(()=> {
    }, [toast])

    return (
        <div>
            <Menu showCreate={showCreate} currentUser={currentUser}> 
                {children}
            </Menu>
            {
                toast.visible &&
                <Toast type={toast.type} timeout={toast.timeout} message={toast.message} updateVisible={toast.updateVisible}/>
            }
        </div>
    )
}
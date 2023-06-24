import Menu from './Menu';

export default function Layout({children, showCreate, currentUser}) {

    

    return (
        <div>
            <Menu showCreate={showCreate} currentUser={currentUser}> 
                {children}
            </Menu>
        </div>
    )
}
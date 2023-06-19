
import Menu from './Menu';

export default function Layout({children, showCreate}) {

    return (
        <div>
            <Menu showCreate={showCreate}> 
                {children}
            </Menu>
        </div>
    )
}
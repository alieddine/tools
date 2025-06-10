import NavBar from '@/components/custom/NavBar'
import { Outlet } from 'react-router-dom'

function MainRoute() {
    if (window.location.pathname === '/') {
        window.location.pathname = '/home';
    }
    return (
        <div className=" w-full h-dvh bg-background space-y-1">
            <NavBar />

            <div className="flex  h-[93dvh]  flex-col justify-between">
                
                <Outlet />
                <footer className="bg-navbar-background static bottom-0 w-full flex flex-col justify-between  text-text text-center my-2">
                <div className='m-auto w-[90%] bg-border h-[0.5px] mb-2' />
                <p>&copy; {new Date().getFullYear()} Tools. All rights reserved.</p>
            </footer>
            </div>
            
        </div>
    )
}

export default MainRoute

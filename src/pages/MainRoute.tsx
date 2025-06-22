import NavBar from '@/components/custom/NavBar'
import { Outlet } from 'react-router-dom'

function MainRoute() {
    if (window.location.pathname === '/') {
        window.location.pathname = '/home';
    }
    return (
        <div className="custom-scrollbar w-full h-dvh bg-background  ">
            <NavBar />

            <div className="flex bg-background  h-full w-full  flex-col justify-between">

                <Outlet />

            </div>
            <div className="w-full h-[200px] bg-background"></div>
            <footer className="bg-navbar-background  py-2 gap-2 w-full flex flex-col justify-between  text-text text-center ">
                <div className='m-auto w-[90%] bg-border h-[0.5px] ' />
                <p>&copy; {new Date().getFullYear()} Tools. All rights reserved.</p>
            </footer>

        </div>
    )
}

export default MainRoute

import {Link, useLoaderData, useLocation, useNavigate, useParams} from "react-router";
import {logoutUser} from "~/appwrite/auth";
import {cn} from "lib/utils";

const RootNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const params = useParams();
    const user = useLoaderData() as User | null;

    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in')
    }

    if (!user) return null;

    return (
        <nav className={cn(
            location.pathname === `/travel/${params.tripId}` ? 'bg-white' : 'glassmorphism', 
            'w-full fixed z-50 top-0 left-0'
        )}>
            <header className="root-nav wrapper">
                <Link to='/'>
                    <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                    <h1>TravelEase</h1>
                </Link>

                <aside>
                    {user.status === 'admin' && (
                        <Link 
                            to="/dashboard" 
                            className={cn(
                                'text-base font-normal text-white hidden sm:block', 
                                {"text-dark-100": location.pathname.startsWith('/travel')}
                            )}
                        >
                            Admin Panel
                        </Link>
                    )}

                    <img 
                        src={user?.imageUrl || '/assets/images/david.webp'} 
                        alt={user?.name || 'User'} 
                        referrerPolicy="no-referrer" 
                    />

                    <button 
                        onClick={handleLogout} 
                        className="cursor-pointer"
                        aria-label="Logout"
                    >
                        <img
                            src="/assets/icons/logout.svg"
                            alt="logout"
                            className="size-6 rotate-180"
                        />
                    </button>
                </aside>
            </header>
        </nav>
    )
}
export default RootNavbar
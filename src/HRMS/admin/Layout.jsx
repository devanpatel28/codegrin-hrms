import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { IMAGE_ASSETS } from '@/constants/ImageContants';
import { ROUTES } from '@/constants/RoutesContants';
import { ICON_ASSETS } from '@/constants/IconConstant';

// Sidebar Menu Configuration
const SIDEBAR_MENU = [
    {
        title: 'Overview',
        icon: ICON_ASSETS.HOME,
        path: ROUTES.ADMIN.DASHBOARD,
    },
    {
        title: 'Employees',
        icon: ICON_ASSETS.EMPLOYEES,
        path: ROUTES.ADMIN.EMPLOYEES,
    },
    {
        title: 'Attendance',
        icon: ICON_ASSETS.CALENDAR,
        path: ROUTES.ADMIN.ATTENDANCE,
    },
    {
        title: 'Website Manage',
        icon: ICON_ASSETS.WEBSITE,
        path: null,
        children: [
            {
                title: 'Portfolio',
                icon: ICON_ASSETS.PORTFOLIO,
                path: ROUTES.ADMIN.WEBSITE_MANAGE.PORTFOLIO,
            },
            {
                title: 'Services',
                icon: ICON_ASSETS.SERVICES,
                path: ROUTES.ADMIN.WEBSITE_MANAGE.SERVICES,
            },
            {
                title: 'Courses',
                icon: ICON_ASSETS.COURSES,
                path: ROUTES.ADMIN.WEBSITE_MANAGE.COURSES,
            },
            {
                title: 'Blogs',
                icon: ICON_ASSETS.BLOGS,
                path: ROUTES.ADMIN.WEBSITE_MANAGE.BLOGS,
            },
        ],
    },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminData, setAdminData] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [openMenus, setOpenMenus] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const data = localStorage.getItem('adminData');

        if (!token || !data) {
            navigate(ROUTES.ADMIN.LOGIN, { replace: true });
            return;
        }

        setAdminData(JSON.parse(data));
    }, [navigate]);

    const getInitials = () => {
        if (!adminData) return 'AD';
        const firstInitial = adminData.firstname?.charAt(0).toUpperCase() || '';
        const lastInitial = adminData.lastname?.charAt(0).toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate(ROUTES.ADMIN.LOGIN);
        setShowLogoutModal(false);
    };

    const handleProfile = () => {
        navigate(ROUTES.ADMIN.PROFILE);
    };

    const isActive = (path) => location.pathname === path;

    const isMenuActive = (menu) => {
        if (menu.path) {
            return isActive(menu.path);
        }
        if (menu.children) {
            return menu.children.some(child => isActive(child.path));
        }
        return false;
    };

    const toggleMenu = (menuId) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    if (!adminData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <Icon icon="mdi:loading" className="animate-spin h-8 w-8 text-primary" />
                    <p className="text-white text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex font-primary antialiased">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 z-50 transition-transform duration-300",
                "lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Section */}
                <div className="h-20 flex flex-col gap-2 justify-center items-center border-b border-neutral-800">
                    <img src={IMAGE_ASSETS.LOGO} alt="Logo" className="h-10 w-auto object-contain" />
                    
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    {SIDEBAR_MENU.map((menu) => (
                        <div key={menu.title}>
                            {menu.path ? (
                                <Link
                                    to={menu.path}
                                    onClick={closeSidebar}
                                    className={cn(
                                        "group flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 font-medium",
                                        isActive(menu.path)
                                            ? 'bg-primary/20 text-primary-light'
                                            : 'text-white hover:text-primary hover:bg-neutral-800'
                                    )}
                                >
                                    <Icon icon={menu.icon} className="w-5 h-5 flex-shrink-0" />
                                    <span>{menu.title}</span>
                                </Link>
                            ) : (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(menu.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 font-medium cursor-pointer",
                                            isMenuActive(menu)
                                                ? 'bg-primary/20 text-primary-light'
                                                : 'text-white hover:text-primary hover:bg-neutral-800'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon={menu.icon} className="w-5 h-5 flex-shrink-0" />
                                            <span>{menu.title}</span>
                                        </div>
                                        <Icon
                                            icon="mdi:chevron-down"
                                            className={cn(
                                                "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                                                openMenus[menu.id] && 'rotate-180'
                                            )}
                                        />
                                    </button>

                                    {openMenus[menu.id] && menu.children && (
                                        <div className="ml-6 mt-1 space-y-1 border-l border-primary pl-2">
                                            {menu.children.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    to={child.path}
                                                    onClick={closeSidebar}
                                                    className={cn(
                                                        "group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                                        isActive(child.path)
                                                            ? 'bg-primary/20 text-primary-light'
                                                            : 'text-white hover:text-primary hover:bg-neutral-800'
                                                    )}
                                                >
                                                    <Icon icon={child.icon} className="w-4 h-4" />
                                                    <span>{child.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Header */}
                <header className="h-20 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                        <Icon icon="mdi:menu" className="w-6 h-6 text-white" />
                    </button>

                    <div className="text-sm text-white hidden lg:flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-medium">
                            {new Date().getHours() < 12 ? (
                                <>
                                    <Icon icon="mdi:white-balance-sunny" className="w-5 h-5 text-yellow-300" />
                                    <span className="">Good Morning</span>
                                </>
                            ) : new Date().getHours() < 18 ? (
                                <>
                                    <Icon icon="mdi:weather-sunny" className="w-5 h-5 text-yellow-300" />
                                    <span className="">Good Afternoon</span>
                                </>
                            ) : (
                                <>
                                    <Icon icon="mdi:weather-night" className="w-5 h-5 text-yellow-300" />
                                    <span className="">Good Evening</span>
                                </>
                            )}
                        </div>

                        <span className="block">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>

                    {/* Admin Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors outline-none cursor-pointer">
                                <Avatar className="h-8 w-8 bg-neutral-700">
                                    <AvatarFallback className="bg-neutral-700 text-white text-sm font-medium">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <span className="text-white text-sm font-medium">
                                        {adminData?.firstname} {adminData?.lastname}
                                    </span>
                                    <span className="text-white text-xs">Administrator</span>
                                </div>
                                <Icon icon="mdi:chevron-down" className="w-4 h-4 text-white" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56 bg-neutral-900 border-neutral-800 shadow-xl"
                            align="end"
                            sideOffset={8}
                        >
                            <DropdownMenuItem
                                onSelect={handleProfile}
                                className="px-3 py-2.5 text-sm text-white hover:text-white focus:text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer rounded-sm"
                            >
                                <Icon icon={ICON_ASSETS.USER} className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-neutral-800" />
                            <DropdownMenuItem
                                onSelect={() => setShowLogoutModal(true)}
                                className="px-3 py-2.5 text-sm text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer rounded-sm"
                            >
                                <Icon icon={ICON_ASSETS.LOGOUT} className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Page Content */}
                <main className="bg-neutral-950">
                    <Outlet />
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <Icon icon="mdi:logout" className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-white">
                                    Confirm Logout
                                </DialogTitle>
                                <DialogDescription className="text-white text-sm">
                                    You will need to sign in again to access the dashboard.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-4">
                        <Button
                            variant="default"
                            onClick={() => setShowLogoutModal(false)}
                            className="flex-1 bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white font-medium py-2 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className="flex-1 bg-red-600 text-white hover:bg-red-700 font-medium py-2 cursor-pointer"
                        >
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

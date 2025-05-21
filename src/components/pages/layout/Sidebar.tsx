import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/constants/sidebar";
import { LogIn, User, ChevronRight } from "lucide-react";

interface SidebarProps {
    isOpen?: boolean;
    isTransitioning?: boolean;
}

export default function Sidebar({ isOpen = false, isTransitioning = false }: SidebarProps) {
    const { t } = useTranslation();
    const location = useLocation();
    const { isAuthenticated } = useConvexAuth();
    const [showContent, setShowContent] = useState(isOpen);
    
    // Get current user data with avatar and display name
    const userData = useQuery(api.users.currentUser);

    // Only show content when sidebar is fully open and not transitioning
    useEffect(() => {
        if (isOpen && !isTransitioning) {
            // Show content with a slight delay to ensure animation is complete
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            // Hide content immediately when closing starts
            setShowContent(false);
        }
    }, [isOpen, isTransitioning]);

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={cn(
            "border-r h-full flex flex-col transition-all duration-300",
            "bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800"
        )}>
            {/* Main navigation links */}
            <nav className="flex-1 py-4">
                <ul className="space-y-1">
                    {sidebarItems.map(item => (
                        <li key={item.key}>
                            <Link
                                to={item.route}
                                className={cn(
                                    "flex items-center py-3 px-4 transition-colors",
                                    "hover:bg-gray-100 dark:hover:bg-zinc-800",
                                    isActive(item.route)
                                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium"
                                        : "text-gray-700 dark:text-zinc-300"
                                )}
                            >
                                <div className="shrink-0"><item.icon size={20} /></div>
                                {showContent && (
                                    <span className="ml-3 transition-opacity duration-150">
                                        {t(item.labelKey)}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Login button at the bottom */}
            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 mt-auto">
                {!isAuthenticated ? (
                    <Link
                        to="/sign-in"
                        className={cn(
                            "flex items-center py-2 px-3 rounded-md transition-colors",
                            "bg-primary text-primary-foreground hover:bg-primary/90",
                            "dark:bg-primary/80 dark:hover:bg-primary/70"
                        )}
                    >
                        <LogIn size={18} />
                        {showContent && <span className="ml-2 transition-opacity duration-150">{t("common.signIn")}</span>}
                    </Link>
                ) : (
                    <Link
                        to="/profile"
                        className={cn(
                            "flex items-center py-2 px-3 rounded-md transition-colors w-full",
                            "bg-primary/10 text-primary hover:bg-primary/20",
                            "dark:bg-primary/20 dark:text-white dark:hover:bg-primary/30"
                        )}
                    >
                        {/* User avatar or default icon */}
                        {userData?.avatarUrl ? (
                            <img 
                                src={userData.avatarUrl}
                                alt={userData.displayName || t("common.profile")}
                                className="w-6 h-6 rounded-full object-cover border border-transparent dark:border-zinc-700"
                            />
                        ) : (
                            <User size={18} className="text-primary dark:text-white" />
                        )}
                        
                        {/* Show displayName with truncation when sidebar is open */}
                        {showContent && (
                            <div className="flex-1 flex items-center justify-between ml-2">
                                <span className="transition-opacity duration-150 truncate max-w-[100px] dark:text-gray-100">
                                    {userData?.displayName || t("common.profile")}
                                </span>
                                <ChevronRight size={16} className="ml-1 text-primary/70 dark:text-white/70" />
                            </div>
                        )}
                    </Link>
                )}
            </div>
        </aside>
    );
}

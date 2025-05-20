import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConvexAuth } from "convex/react";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/constants/sidebar";
import { LogIn } from "lucide-react";

interface SidebarProps {
    isOpen?: boolean;
    isTransitioning?: boolean;
}

export default function Sidebar({ isOpen = false, isTransitioning = false }: SidebarProps) {
    const { t } = useTranslation();
    const location = useLocation();
    const { isAuthenticated } = useConvexAuth();
    const [showContent, setShowContent] = useState(isOpen);

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
            <div className="p-4 border-t dark:border-gray-800 mt-auto">
                {!isAuthenticated ? (
                    <Link
                        to="/sign-in"
                        className={cn(
                            "flex items-center py-2 px-3 rounded-md transition-colors",
                            "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        <LogIn size={18} />
                        {showContent && <span className="ml-2 transition-opacity duration-150">{t("common.signIn")}</span>}
                    </Link>
                ) : (
                    <button
                        className={cn(
                            "flex items-center py-2 px-3 rounded-md transition-colors w-full",
                            "bg-gray-200 text-gray-800 hover:bg-gray-300",
                            "dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        )}
                    >
                        <LogIn size={18} className="rotate-180" />
                        {showContent && <span className="ml-2 transition-opacity duration-150">{t("signIn.signOut")}</span>}
                    </button>
                )}
            </div>
        </aside>
    );
}

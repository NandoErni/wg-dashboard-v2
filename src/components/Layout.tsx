"use client";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Calendar", href: "/calendar" },
  { label: "To-Do", href: "/todo" },
  { label: "Garbage", href: "/garbage" },
  { label: "Photo Booth", href: "/photo" },
  { label: "Weather", href: "/weather" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (href: string) => {
    setOpen(false);         // Close the sheet
    navigate(href);         // Navigate to the route
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col p-4 space-y-4">
        <div className="text-2xl font-bold">🏠 WG Dashboard</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={clsx(
              "px-3 py-2 rounded hover:bg-gray-700 transition",
              isActive(item.href) && "bg-gray-800"
            )}
          >
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Topbar with mobile burger menu */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-900 text-white flex items-center p-4 z-10">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gray-900 text-white w-64 p-4">
            <div className="text-xl font-bold mb-4">🏠 WG Dashboard</div>
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={clsx(
                  "block text-left w-full mb-2 px-3 py-2 rounded hover:bg-gray-700",
                  isActive(item.href) && "bg-gray-800"
                )}
              >
                {item.label}
              </button>
            ))}
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0 p-4">
        {children}
      </main>
    </div>
  );
}

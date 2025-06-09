"use client";
import { LayoutDashboard, Camera, Settings, UserRound, Image } from "lucide-react"
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import Logo from "@/components/wege-logo";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Photo Booth", icon: Camera, href: "/photobooth" },
  { label: "Images", icon: Image, href: "/images" },
  { label: "People", icon: UserRound, href: "/people" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const isActive = (href: string) => location.pathname === href;  // this could be used to show a loading circle or something

  return (
    <div className="flex h-screen w-screen bg-background transition-colors duration-300 ease-in-out">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col p-4 h-full">
        <div className="text-2xl">
          <Logo />
        </div>

        <div className="flex flex-col flex-grow py-8 items-center space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-3 py-2 rounded transition"
            >
              <item.icon className="w-9 h-9" />
            </Link>
          ))}
        </div>
      </aside>

      {/* Topbar with mobile burger menu */}
      <div className="md:hidden fixed top-0 left-0 w-full p-4 z-10">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6">
            <SheetHeader>
                <SheetTitle className="flex flex-row items-center gap-4"><Logo />Weegee Dashboard</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6">
                {navItems.map((item) => (
                <button
                    key={item.href}
                    onClick={() => handleNav(item.href)}
                    className={clsx(
                    "flex items-start gap-2 text-l pl-4"
                    )}
                >
                    { <><item.icon /> {item.label}</>}
                </button>
                ))}
            </div>
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

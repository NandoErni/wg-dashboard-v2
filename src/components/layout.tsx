"use client";
import {
  LayoutDashboard,
  Camera,
  Settings,
  UserRound,
  Image,
  CloudOff,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Logo from "@/components/svg/wege-logo";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const navItems = [
    { label: t("system.dashboard"), icon: LayoutDashboard, href: "/" },
    { label: t("system.photoBooth"), icon: Camera, href: "/photobooth" },
    { label: t("system.imageGallery"), icon: Image, href: "/images" },
    { label: t("system.people"), icon: UserRound, href: "/people" },
    { label: t("system.settings"), icon: Settings, href: "/settings" },
  ];

  // Der Status-Indikator als eigene Komponente
  const ConnectionStatus = () => {
    if (user) return null; // Kollabiert komplett, wenn eingeloggt

    return (
      <div className="flex flex-col items-center lg:items-start w-full mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <button
          onClick={() => handleNav("/settings")}
          className="relative flex items-center gap-3 px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-all group">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-destructive/40 animate-ping" />
            <CloudOff className="w-5 h-5 text-destructive relative z-10" />
          </div>
          <span className="text-xs font-bold text-destructive uppercase tracking-tighter">
            Offline
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-[100dvh] w-screen bg-background p-8">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col p-8 h-full bg-card rounded-2xl shadow-2xl">
        {/* Status über dem Logo */}
        <ConnectionStatus />

        <div className="text-2xl flex flex-col gap-3">
          <Logo />
          {t("system.title")}
        </div>

        <div className="flex flex-col py-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="py-2 rounded grid grid-cols-[40%_60%]">
              <item.icon className="w-9 h-9" />
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Topbar with mobile burger menu */}
      <div className="lg:hidden fixed top-0 left-0 w-full p-4 z-10">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6">
            <SheetHeader>
              <SheetTitle className="flex flex-row items-center gap-4">
                <Logo />
                {t("system.title")}
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={clsx("flex items-start gap-2 text-l pl-4")}>
                  {
                    <>
                      <item.icon /> {item.label}
                    </>
                  }
                </button>
              ))}
            </div>
            <SheetDescription className="mt-auto">
              Made By Nando Erni
            </SheetDescription>
          </SheetContent>
        </Sheet>

        <ConnectionStatus />
      </div>

      {/* Main content */}
      <main className="flex-1 md:pt-0 p-4">{children}</main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Repository } from "@/lib/repository";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  LogIn,
  LogOut,
  Languages,
  User as UserIcon,
  Palette,
} from "lucide-react";
import { AVAILABLE_THEMES, useTheme } from "../components/theme-provider";

// Define strict typing to align with your ThemeProvider types
type Theme = "default" | "dark" | "ocean" | "system";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await Repository.loginWithGoogle();
      toast.success(t("settings.loginSuccess"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await Repository.logout();
      toast.success(t("settings.logoutSuccess"));
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("app-lang", value);
    toast.success(t("settings.langChanged"));
  };

  return (
    <div className="container max-w-2xl py-10 space-y-6">
      <h1 className="text-3xl font-bold px-2">{t("settings.title")}</h1>

      {/* Profile Section */}
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            <CardTitle>{t("settings.profile")}</CardTitle>
          </div>
          <CardDescription>{t("settings.profileDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="h-16 w-full animate-pulse bg-muted rounded-md" />
          ) : user ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user.photoURL || ""}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" />
                {t("settings.logout")}
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                {t("settings.notLoggedIn")}
              </p>
              <Button onClick={handleLogin} className="gap-2">
                <LogIn className="w-4 h-4" />
                {t("settings.login")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            <CardTitle>{t("settings.preferences")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selector */}
          <div className="space-y-2">
            <Label htmlFor="language">{t("settings.language")}</Label>
            <Select value={i18n.language} onValueChange={changeLanguage}>
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de-CH">Deutsch (Schweiz)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme-select">{t("settings.appearance")}</Label>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}>
              <SelectTrigger id="theme-select" className="w-full h-12">
                <div className="flex items-center gap-3 font-normal">
                  <Palette className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Select Theme" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.values(AVAILABLE_THEMES).map((themeOption) => (
                  <SelectItem key={themeOption.id} value={themeOption.id}>
                    {themeOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

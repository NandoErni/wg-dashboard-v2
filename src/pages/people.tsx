"use client";

import { useEffect, useState } from "react";
import { Repository } from "@/lib/repository";
import { CHORE_PEOPLE, CHORES } from "../constants";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type PersonStats = {
  name: string;
  birthday: string;
  img: string;
  altImg: string;
  counts: Record<string, number>;
  total: number;
  topChoreName: string;
  topChoreIcon: React.ReactNode;
};

export default function People() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<PersonStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allCompletions = await Repository.getAllChoreCompletions();

        const calculatedStats = CHORE_PEOPLE.map((person) => {
          const userCompletions = allCompletions.filter(
            (c: any) => c.completedBy === person.name,
          );

          const counts: Record<string, number> = {};
          let total = 0;

          CHORES.forEach((chore) => {
            const key = chore.nameResource;
            const count = userCompletions.filter(
              (c: any) => c.choreType === key,
            ).length;
            counts[key] = count;
            total += count;
          });

          const topChore = CHORES.reduce((prev, current) => {
            const prevKey = prev.nameResource;
            const currKey = current.nameResource;
            return (counts[currKey] || 0) > (counts[prevKey] || 0)
              ? current
              : prev;
          });

          return {
            ...person,
            counts,
            total,
            topChoreName: t(topChore.nameResource),
            topChoreIcon: topChore.icon,
          };
        });

        setStats(calculatedStats.sort((a, b) => b.total - a.total));
      } catch (err) {
        console.error("Failed to load people stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  const maxTotal =
    stats.length > 0 ? Math.max(...stats.map((s) => s.total)) : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t("system.loading")}</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("people.title")}
        </h1>
        <p className="text-muted-foreground">{t("people.subtitle")}</p>
      </header>

      <div className="grid gap-6">
        {stats.map((person, index) => {
          const isWinner = person.total === maxTotal && maxTotal > 0;

          return (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}>
              <Card
                className={
                  isWinner ? "border-primary shadow-xl bg-primary/5" : ""
                }>
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                  {/* Ranking Section */}
                  <div className="flex-shrink-0 w-12 text-center">
                    {isWinner ? (
                      <Trophy className="w-10 h-10 text-yellow-500 mx-auto animate-pulse" />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* Profile Pictures */}
                  <div className="relative group w-24 h-24 shrink-0">
                    <Avatar className="w-24 h-24 border-2 border-background shadow-md">
                      <AvatarImage
                        src={person.img}
                        className="object-cover group-hover:opacity-0 transition-opacity duration-300"
                      />
                      <AvatarImage
                        src={person.altImg}
                        className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <AvatarFallback className="text-xl font-bold">
                        {person.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {person.name}
                    </h3>
                    <p className="text-sm text-muted-foreground italic mb-3">
                      🎂 {person.birthday}
                    </p>
                    <Badge variant="secondary" className="gap-2 py-1 px-3">
                      <div className="w-4 h-4 flex items-center justify-center">
                        {person.topChoreIcon}
                      </div>
                      {t("people.expert")}: {person.topChoreName}
                    </Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
                    {CHORES.map((chore) => {
                      const key = chore.nameResource;
                      return (
                        <StatBox
                          key={key}
                          icon={
                            <div className="w-4 h-4 flex items-center justify-center grayscale brightness-0 dark:invert">
                              {chore.icon}
                            </div>
                          }
                          label={t(chore.nameResource)}
                          value={person.counts[key] || 0}
                        />
                      );
                    })}
                    <StatBox
                      icon={
                        <Star size={16} className="text-primary fill-primary" />
                      }
                      label={t("people.total")}
                      value={person.total}
                      highlight
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center min-w-[85px] transition-all duration-200 ${
        highlight
          ? "bg-primary text-primary-foreground border-primary scale-105 shadow-md"
          : "bg-muted/40 hover:bg-muted/60"
      }`}>
      <div className="mb-1">{icon}</div>
      <span className="text-xl font-bold leading-none">{value}</span>
      <span className="text-[10px] uppercase tracking-widest opacity-70 mt-1 font-semibold">
        {label}
      </span>
    </div>
  );
}

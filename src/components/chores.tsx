"use client";

import { ChoreCard } from "@/components/choreCard";
import { ChoreIcon } from "@/components/choreIcon";
import { appConfig } from "@/config/app-config";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Repository } from "@/lib/repository";

type Person = (typeof appConfig.chores.people)[number];
type Chore = (typeof appConfig.chores.items)[number];

interface Assignment {
  person: Person;
  chore: Chore;
  nextChoreInDays: number;
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getDayDiff(from: Date, to: Date) {
  return Math.floor(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

function getMonthDiff(from: Date, to: Date) {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  );
}

function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getFirstDayOfNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function getMondayOfWeek(date: Date) {
  const result = startOfDay(date);
  const day = result.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diffToMonday);

  return result;
}

function getNextMonday(date: Date) {
  const monday = getMondayOfWeek(date);
  monday.setDate(monday.getDate() + 7);

  return monday;
}

function getRotationInfo(today: Date) {
  const rotation = appConfig.chores.rotation;
  const startDate = startOfDay(new Date(appConfig.chores.startDate));

  if (rotation.type === "weekly") {
    const startMonday = getMondayOfWeek(startDate);
    const currentMonday = getMondayOfWeek(today);
    const rotationsPassed = Math.floor(
      getDayDiff(startMonday, currentMonday) / 7,
    );

    return {
      rotationsPassed,
      nextChoreInDays: getDayDiff(today, getNextMonday(today)),
    };
  }

  if (rotation.type === "days") {
    const rotationDays = Math.max(rotation.days, 1);
    const dayDiff = getDayDiff(startDate, today);
    const rotationsPassed = Math.floor(dayDiff / rotationDays);

    return {
      rotationsPassed,
      nextChoreInDays: rotationDays - (dayDiff % rotationDays),
    };
  }

  const startMonth = getFirstDayOfMonth(startDate);
  const currentMonth = getFirstDayOfMonth(today);

  return {
    rotationsPassed: getMonthDiff(startMonth, currentMonth),
    nextChoreInDays: getDayDiff(today, getFirstDayOfNextMonth(today)),
  };
}

/**
 * Returns today's assignments based on the configured rotation.
 */
function getTodaysAssignments(): Assignment[] {
  const people = appConfig.chores.people;
  const chores = appConfig.chores.items;

  if (people.length === 0 || chores.length === 0) {
    return [];
  }

  const today = new Date();
  const { rotationsPassed, nextChoreInDays } = getRotationInfo(today);

  const rotatedPeople = people.map(
    (_, i) => people[(i + rotationsPassed) % people.length],
  );

  return chores.map((chore, i) => ({
    person: rotatedPeople[i % rotatedPeople.length],
    chore,
    nextChoreInDays,
  }));
}

export default function Chores() {
  const { t } = useTranslation();
  const [todaysAssignments, setTodaysAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    setTodaysAssignments(getTodaysAssignments());
    Repository.ensureChorePeriodExists(appConfig.chores.rotation);

    const interval = setInterval(() => {
      setTodaysAssignments(getTodaysAssignments());
      Repository.ensureChorePeriodExists(appConfig.chores.rotation);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {todaysAssignments.map((assignment) => (
        <ChoreCard
          key={assignment.chore.id}
          icon={<ChoreIcon name={assignment.chore.icon} />}
          user={assignment.person.name}
          daysUntilNextChore={assignment.nextChoreInDays}
          additionalTrash={t(`custom.chores.${assignment.chore.id}.description`)}
          choreType={assignment.chore.id}
        />
      ))}
    </>
  );
}
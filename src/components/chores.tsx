"use client";

import {
  CHORE_PEOPLE,
  CHORE_ROTATION_DAYS,
  CHORE_START_DATE,
  CHORES,
  type CHORE,
  type PERSON,
} from "@/constants";
import { ChoreCard } from "@/components/choreCard";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface Assignment {
  person: PERSON;
  chore: CHORE;
  nextChoreInDays: number;
}

/**
 * Returns today's assignments based on rotationDays
 * @param rotationDays Number of days each assignment lasts
 */
function getTodaysAssignments(): Assignment[] {
  const today = new Date();

  const startDate = new Date(CHORE_START_DATE);
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const dayDiff = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const rotationsPassed = Math.floor(dayDiff / CHORE_ROTATION_DAYS);

  const rotatedPeople = CHORE_PEOPLE.map(
    (_, i) => CHORE_PEOPLE[(i + rotationsPassed) % CHORE_PEOPLE.length],
  );

  return CHORES.map((chore, i) => ({
    person: rotatedPeople[i],
    chore,
    nextChoreInDays: CHORE_ROTATION_DAYS - (dayDiff % CHORE_ROTATION_DAYS),
  }));
}

export default function Chores() {
  const { t } = useTranslation();
  const [todaysAssignments, setTodaysAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    setTodaysAssignments(getTodaysAssignments());

    const interval = setInterval(() => {
      setTodaysAssignments(getTodaysAssignments());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {todaysAssignments.map((assignment) => (
        <ChoreCard
          key={assignment.chore.nameResource}
          icon={assignment.chore.icon}
          user={assignment.person.name}
          daysUntilNextChore={assignment.nextChoreInDays}
          additionalTrash={t(assignment.chore.descriptionResource)}
          choreType={assignment.chore.nameResource}
        />
      ))}
    </>
  );
}

import {
  CHORE_PEOPLE,
  CHORE_ROTATION_DAYS,
  CHORE_START_DATE,
  CHORES,
  type CHORE,
} from "@/constants";
import { ChoreCard } from "@/components/ChoreCard";
import { useTranslation } from "react-i18next";

interface Assignment {
  person: string;
  chore: CHORE;
  nextChoreInDays: number;
}

/**
 * Returns today's assignments based on rotationDays
 * @param rotationDays Number of days each assignment lasts
 */
function getTodaysAssignments(): Assignment[] {
  const today = new Date();
  const dayDiff = Math.floor(
    (today.getTime() - CHORE_START_DATE.getTime()) / (1000 * 60 * 60 * 24)
  );

  const rotationsPassed = Math.floor(dayDiff / CHORE_ROTATION_DAYS);

  const rotatedPeople = CHORE_PEOPLE.map(
    (_, i) => CHORE_PEOPLE[(i + rotationsPassed) % CHORE_PEOPLE.length]
  );

  return CHORES.map((chore, i) => ({
    person: rotatedPeople[i],
    chore,
    nextChoreInDays: CHORE_ROTATION_DAYS - (dayDiff - CHORE_ROTATION_DAYS * rotationsPassed),
  }));
}

export default function Chores() {
  const { t } = useTranslation();
  const todaysAssignments = getTodaysAssignments();
  return (
    <>
      {todaysAssignments.map((assignment) => (
        <ChoreCard
          key={assignment.person}
          icon={assignment.chore.icon}
          user={assignment.person}
          daysUntilNextChore={assignment.nextChoreInDays}
          additionalTrash={t(assignment.chore.descriptionResource)}
        />
      ))}
    </>
  );
}

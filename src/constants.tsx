import { PoopIcon } from "@/components/svg/Shit";
import { BroomIcon } from "@/components/svg/Broom";
import { CutleryIcon } from "@/components/svg/Cutlery";
import type { JSX } from "react";

export type CHORE = {
  nameResource: string;
  icon: JSX.Element;
  descriptionResource: string;
};

///  This file contains constants that later could be turned into a config file or something
export const CHORE_ROTATION_DAYS = 30;
export const CHORE_START_DATE = new Date("2025-01-01");
export const CHORE_PEOPLE = ["Nando", "Michelle", "Timon"];
export const CHORES: CHORE[] = [
  {
    nameResource: "custom.chores.bathroom.name",
    icon: <PoopIcon />,
    descriptionResource: "custom.chores.bathroom.description",
  },
  {
    nameResource: "custom.chores.floor.name",
    icon: <BroomIcon />,
    descriptionResource: "custom.chores.floor.description",
  },
  {
    nameResource: "custom.chores.kitchen.name",
    icon: <CutleryIcon />,
    descriptionResource: "custom.chores.kitchen.description",
  },
];

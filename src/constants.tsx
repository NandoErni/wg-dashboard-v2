import { PoopIcon } from "@/components/svg/Shit";
import { BroomIcon } from "@/components/svg/Broom";
import { CutleryIcon } from "@/components/svg/Cutlery";
import type { JSX } from "react";

export type CHORE = {
  nameResource: string;
  icon: JSX.Element;
  descriptionResource: string;
};

export type PERSON = {
  name: string;
  birthday: string;
  img: string;
  altImg: string;
};

export const CHORE_ROTATION_DAYS = 30;
export const CHORE_START_DATE = new Date("2025-01-01");

export const CHORE_PEOPLE: PERSON[] = [
  {
    name: "Nando",
    birthday: "18.12.2000",
    img: "/people/nando-1.jpg",
    altImg: "/people/nando-2.jpg",
  },
  {
    name: "Michelle",
    birthday: "04.11.1998",
    img: "/people/michelle-1.jpg",
    altImg: "/people/michelle-2.jpg",
  },
  {
    name: "Timon",
    birthday: "25.11.1999",
    img: "/people/timon-1.jpg",
    altImg: "/people/timon-2.jpg",
  },
];

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

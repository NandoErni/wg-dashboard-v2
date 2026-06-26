import { BroomIcon } from "@/components/svg/Broom";
import { CutleryIcon } from "@/components/svg/Cutlery";
import { PoopIcon } from "@/components/svg/Shit";
import type { JSX } from "react";

type ChoreIconProps = {
  name: string;
};

const choreIcons: Record<string, JSX.Element> = {
  poop: <PoopIcon />,
  broom: <BroomIcon />,
  cutlery: <CutleryIcon />,
};

export function ChoreIcon({ name }: ChoreIconProps) {
  const icon = choreIcons[name];

  if (!icon) {
    console.warn(`Chore icon not found: ${name}`);
    return null;
  }

  return icon;
}
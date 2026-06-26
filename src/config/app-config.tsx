import YAML from "yaml";
import configYaml from "./config.yaml?raw";

export type AppConfig = {
  appTitle: string;
  pages: {
    dashboard: boolean;
    photoBooth: boolean;
    photoBoothGallery: boolean;
    people: boolean;
    settings: boolean;
  };
  dashboard: {
    holidayCountry: string;
    cards: {
      trash: boolean;
      weatherOutfit: boolean;
    };
    sbbBus: {
      from: string;
      to: string;
    };
  };
  chores: {
    rotation: ChoreRotationConfig;
    startDate: string;
    people: {
      name: string;
      birthday: string;
      img: string;
      altImg: string;
    }[];
    items: {
      id: string;
      icon: string;
    }[];
  };
};

export type ChoreRotationConfig =
  | {
      type: "monthly";
    }
  | {
      type: "weekly";
    }
  | {
      type: "days";
      days: number;
    };

const parsedConfig = (YAML.parse(configYaml) ?? {}) as Partial<AppConfig>;

function normalizeChoreRotation(
  rotation: Partial<ChoreRotationConfig> | undefined,
): ChoreRotationConfig {
  if (rotation?.type === "weekly") {
    return {
      type: "weekly",
    };
  }

  if (rotation?.type === "days") {
    return {
      type: "days",
      days: "days" in rotation && rotation.days ? rotation.days : 30,
    };
  }

  return {
    type: "monthly",
  };
}

const defaultConfig: AppConfig = {
  appTitle: "Dashboard",
  pages: {
    dashboard: true,
    photoBooth: true,
    photoBoothGallery: true,
    people: true,
    settings: true,
  },
  dashboard: {
    holidayCountry: "CH",
    cards: {
      trash: true,
      weatherOutfit: true,
    },
    sbbBus: {
      from: "8590930",
      to: "8506000",
    },
  },
  chores: {
    rotation: {
      type: "monthly",
    },
    startDate: "2025-01-01",
    people: [],
    items: [],
  },
};

export const appConfig: AppConfig = {
  ...defaultConfig,
  ...parsedConfig,
  pages: {
    ...defaultConfig.pages,
    ...parsedConfig.pages,
  },
  dashboard: {
    ...defaultConfig.dashboard,
    ...parsedConfig.dashboard,
    cards: {
      ...defaultConfig.dashboard.cards,
      ...parsedConfig.dashboard?.cards,
    },
    sbbBus: {
      ...defaultConfig.dashboard.sbbBus,
      ...parsedConfig.dashboard?.sbbBus,
    },
  },
  chores: {
    ...defaultConfig.chores,
    ...parsedConfig.chores,
    rotation: normalizeChoreRotation(parsedConfig.chores?.rotation),
    people: parsedConfig.chores?.people ?? defaultConfig.chores.people,
    items: parsedConfig.chores?.items ?? defaultConfig.chores.items,
  },
};


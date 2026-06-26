import YAML from "yaml";
import customTranslationsYaml from "./custom-translations.yaml?raw";

export type CustomTranslations = Record<string, Record<string, unknown>>;

export const customTranslations = (YAML.parse(customTranslationsYaml) ??
  {}) as CustomTranslations;
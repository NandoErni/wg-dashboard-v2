declare module "ical-expander" {
  interface ICalEvent {
    summary: string;
    startDate: { toJSDate: () => Date };
    endDate: { toJSDate: () => Date };
    [key: string]: any;
  }

  interface BetweenResult {
    events: ICalEvent[];
    occurrences: ICalEvent[];
  }

  interface ICalExpanderOptions {
    ics: string;
    maxIterations?: number;
  }

  class IcalExpander {
    constructor(options: ICalExpanderOptions);
    between(start: Date, end: Date): BetweenResult;
  }

  export default IcalExpander;
}

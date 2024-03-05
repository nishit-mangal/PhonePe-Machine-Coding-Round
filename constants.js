export const EventType = {
  APP_INSTALL_COMPLETED: "APP_INSTALL_COMPLETED",
};
export const AggregationType = {
  COUNT: "count",
  SUM: "sum",
};
export const AggregationKeywords = {
    INSTALL_COUNT_USER: "INSTALL_COUNT_USER",
    TOTAL_SPACE_USED: "TOTAL_SPACE_USED"
}
export const AggregationsMetadata = {
  INSTALL_COUNT_USER: {
    aggregationName: "installCountUser",
    eventType: EventType.APP_INSTALL_COMPLETED,
    aggregationType: AggregationType.COUNT,
    aggregationKey: "userId",
    aggregationField: "spaceInMb",
    timeInterval: 5 * 60 * 1000,

    filterRules: [
      {
        field: "spaceInMb",
        op: "gt",
        value: 2,
      },
    ],
  },

  TOTAL_SPACE_USED: {
    aggregationName: "totalSpaceUsed",
    eventType: EventType.APP_INSTALL_COMPLETED,
    aggregationType: AggregationType.SUM,
    aggregationKey: "userId",
    aggregationField: "spaceInMb",
    timeInterval: 5 * 60 * 1000,
    filterRules: [],
  },
};


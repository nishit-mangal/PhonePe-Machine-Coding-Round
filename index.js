import { AggregateRunning } from "./aggregateRunning.js";
import { AggregationKeywords, EventType } from "./constants.js";

try {
  //Assumption: timestamp is continuously increasing
  const dataPipeline = [
    {
      eventType: EventType.APP_INSTALL_COMPLETED,
      timestamp: "1706452811465",
      eventData: {
        appName: "app1",
        source: "home",
        userId: "u001",
        spaceInMb: 2,
      },
    },
    {
      eventType: EventType.APP_INSTALL_COMPLETED,
      timestamp: "1706452811500",
      eventData: {
        appName: "app2",
        source: "home",
        userId: "u001",
        spaceInMb: 3,
      },
    },
    {
      eventType: EventType.APP_INSTALL_COMPLETED,
      timestamp: "1706452811520",
      eventData: {
        appName: "app2",
        source: "home",
        userId: "u002",
        spaceInMb: 3,
      },
    },
    {
      eventType: EventType.APP_INSTALL_COMPLETED,
      timestamp: "1706452811675",
      eventData: {
        appName: "app3",
        source: "home",
        userId: "u002",
        spaceInMb: 4,
      },
    },
  ];

  //simulation for runnign case
  for (let i = 0; i < dataPipeline.length; i++) {
    new AggregateRunning(dataPipeline[i]);
    try {
      console.log(
        "Install Count User Data for User 2",
        AggregateRunning.getAggregation(
          AggregationKeywords.INSTALL_COUNT_USER,
          "u002"
        )
      );
    } catch (err) {
      console.log(err);
    }
    try {
      console.log(
        "Total Space Used Data for User 1",
        AggregateRunning.getAggregation(
          AggregationKeywords.TOTAL_SPACE_USED,
          "u001"
        )
      );
    } catch (err) {
      console.log(err);
    }
  }
} catch (err) {
  console.log(err);
}

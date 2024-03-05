import { Aggregate } from "./aggregate.js";
import { AggregateRunning } from "./aggregateRunning.js";
import { EventType } from "./constants.js";

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

  // let aggregation = new Aggregate(dataPipeline);
  // console.log(aggregation.getAggregation())

  //for runnign case
  for(let i=0; i<dataPipeline.length; i++){
    let aggregationRunning = new AggregateRunning(dataPipeline[i])
    console.log(aggregationRunning.getAggregation())
  }
  
} catch (err) {
  console.log(err);
}

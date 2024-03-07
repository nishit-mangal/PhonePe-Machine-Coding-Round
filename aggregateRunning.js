import { AggregationKeywords, AggregationsMetadata } from "./constants.js";

// let aggragationResults = {
//   installCountUser: new Map(),
//   totalSpaceUsed: new Map(),
// };
let userAggregationData = new Map();
export class AggregateRunning {
  // currentTimestamp = 1706453111464;
  currEvent;

  constructor(event) {
    if (
      !event ||
      !event.timestamp ||
      !event.eventData ||
      !event.eventData.userId
    ) {
      throw "Invalid Input";
    }
    this.currEvent = event;

    //compare timestamps
    let existingTimestamp = 0;
    if (!userAggregationData.has(this.currEvent.eventData.userId)) {
      userAggregationData.set(this.currEvent.eventData.userId, {
        timestamp: parseInt(this.currEvent.timestamp),
      });
      existingTimestamp = this.currEvent.timestamp;
    } else {
      existingTimestamp = userAggregationData.get(
        this.currEvent.eventData.userId
      ).timestamp;
    }

    let currentTimestamp = parseInt(this.currEvent.timestamp);

    this.#performInstallCountUserAggregation(
      currentTimestamp,
      existingTimestamp
    );
  }

  #performInstallCountUserAggregation(currentTimestamp, existingTimestamp) {
    if (
      currentTimestamp - existingTimestamp <
      AggregationsMetadata.INSTALL_COUNT_USER.timeInterval
    ) {
      if (
        this.currEvent.eventData.spaceInMb >
        AggregationsMetadata.INSTALL_COUNT_USER.filterRules[0].value
      ) {
        
        let tempUserObject = userAggregationData.get(
          this.currEvent.eventData.userId
        );

        console.log("Already exixsting User Data: ", tempUserObject);

        if (!tempUserObject[`${AggregationKeywords.INSTALL_COUNT_USER}`]) {
          tempUserObject[`${AggregationKeywords.INSTALL_COUNT_USER}`] = 1;
        } else {
          tempUserObject[`${AggregationKeywords.INSTALL_COUNT_USER}`] += 1;
        }
        console.log(tempUserObject);

        userAggregationData.set(
          this.currEvent.eventData.userId,
          tempUserObject
        );
      }
    } else {
      aggragationResults.installCountUser = new Map();
    }
  }
  #performTotalSpaceUsedAggregation() {
    if (
      this.currentTimestamp - parseInt(this.currEvent.timestamp) <
      AggregationsMetadata.TOTAL_SPACE_USED.timeInterval
    ) {
      aggragationResults.totalSpaceUsed.set(
        this.currEvent.eventData.userId,
        (aggragationResults.totalSpaceUsed.get(
          this.currEvent.eventData.userId
        ) || 0) + this.currEvent.eventData.spaceInMb
      );
    } else {
      aggragationResults.totalSpaceUsed = new Map();
    }
  }
  getAggregation(aggregaionKey, userId) {
    if(!aggregaionKey || !userId){
      throw `Invalid Input to fetch Aggregation`
    }
    if (!userAggregationData.has(userId)) {
     throw `User not found for the ${userId}`;
    }
    let aggregationData = userAggregationData.get(userId);
    if (!aggregationData || !aggregationData[`${aggregaionKey}`]) {
      throw `No relevant aggregation data found for the uaer with id ${userId}`;
    }
    // this.#performInstallCountUserAggregation();
    // this.#performTotalSpaceUsedAggregation();
    return aggregationData[`${aggregaionKey}`];
  }
}

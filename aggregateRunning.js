import { AggregationKeywords, AggregationsMetadata } from "./constants.js";

let userAggregationData = new Map();

export class AggregateRunning {
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
    this.#performTotalSpaceUsedAggregation(currentTimestamp, existingTimestamp);
  }

  #performInstallCountUserAggregation(currentTimestamp, existingTimestamp) {
    let tempUserObject = userAggregationData.get(
      this.currEvent.eventData.userId
    );
    if (
      currentTimestamp - existingTimestamp <
      AggregationsMetadata.INSTALL_COUNT_USER.timeInterval
    ) {
      if (
        this.currEvent.eventData.spaceInMb >
        AggregationsMetadata.INSTALL_COUNT_USER.filterRules[0].value
      ) {
        // console.log("Already exixsting User Data: ", tempUserObject);

        if (!tempUserObject[`${AggregationKeywords.INSTALL_COUNT_USER}`]) {
          tempUserObject[`${AggregationKeywords.INSTALL_COUNT_USER}`] = 1;
        } else {
          tempUserObject[`${AggregationKeywords.INSTALL_COUNT_USER}`] += 1;
        }
        // console.log(tempUserObject);
      }
    } else {
      tempUserObject[`${AggregationKeywords.INSTALL_COUNT_USER}`] = 0;
    }
    userAggregationData.set(this.currEvent.eventData.userId, tempUserObject);
  }

  #performTotalSpaceUsedAggregation(currentTimestamp, existingTimestamp) {
    let tempUserObject = userAggregationData.get(
      this.currEvent.eventData.userId
    );
    if (
      currentTimestamp - existingTimestamp <
      AggregationsMetadata.TOTAL_SPACE_USED.timeInterval
    ) {
      // console.log("Already exixsting User Data: ", tempUserObject);
      if (!tempUserObject[`${AggregationKeywords.TOTAL_SPACE_USED}`]) {
        tempUserObject[`${AggregationKeywords.TOTAL_SPACE_USED}`] = this.currEvent.eventData.spaceInMb;
      } else {
        tempUserObject[`${AggregationKeywords.TOTAL_SPACE_USED}`] += this.currEvent.eventData.spaceInMb;
      }
    } else {
      tempUserObject[`${AggregationKeywords.TOTAL_SPACE_USED}`] = 0;
    }
    userAggregationData.set(this.currEvent.eventData.userId, tempUserObject);
  }
  static getAggregation(aggregaionKey, userId) {
    if (!aggregaionKey || !userId) {
      throw `Invalid Input to fetch Aggregation`;
    }
    if (!userAggregationData.has(userId)) {
      throw `User not found for the ${userId}`;
    }
    let aggregationData = userAggregationData.get(userId);
    if (!aggregationData || !aggregationData[`${aggregaionKey}`]) {
      throw `No relevant aggregation data found for the uaer with id ${userId}`;
    }
    return aggregationData[`${aggregaionKey}`];
  }
}

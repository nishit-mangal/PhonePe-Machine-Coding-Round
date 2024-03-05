import { AggregationKeywords, AggregationsMetadata } from "./constants.js";

export class Aggregate {
  finalEventArr;
  aggragationResults = {
    installCountUser: new Map(),
    totalSpaceUsed: new Map(),
  };
  currentTimestamp = 1706453111464;
  constructor(eventArr) {
    if (!eventArr || eventArr.length == 0) {
      throw "Invalid Event Data. Can not be processed";
    }
    this.finalEventArr = eventArr;
    console.log("Event Created Successfully.");
  }

  #fileterRelevantData(aggregationKeyword) {
    let newArr = [];
    for (let i = this.finalEventArr.length - 1; i >= 0; i--) {
      if (!this.finalEventArr[i]?.timestamp) {
        console.log("Invalid Event", this.finalEventArr[i]);
        continue;
      }
      let aggragationTimestamp;

      if (aggregationKeyword == AggregationKeywords.INSTALL_COUNT_USER) {
        aggragationTimestamp =
          AggregationsMetadata.INSTALL_COUNT_USER.timeInterval;
      } else if (aggregationKeyword == AggregationKeywords.TOTAL_SPACE_USED) {
        aggragationTimestamp =
          AggregationsMetadata.TOTAL_SPACE_USED.timeInterval;
      }
      if (
        this.currentTimestamp - parseInt(this.finalEventArr[i].timestamp) <
        aggragationTimestamp
      ) {
        newArr.push(this.finalEventArr[i]);
      } else {
        console.log("time exceeded for calculation");
        break;
      }
    }
    return newArr;
  }
  #performInstallCountUserAggregation() {
    let newArr = this.#fileterRelevantData(
      AggregationKeywords.INSTALL_COUNT_USER
    );
    for (let i = 0; i < newArr.length; i++) {
      if (
        newArr[i].eventData.spaceInMb >
        AggregationsMetadata.INSTALL_COUNT_USER.filterRules[0].value
      ) {
        this.aggragationResults.installCountUser.set(
          newArr[i].eventData.userId,
          (this.aggragationResults.installCountUser.get(
            newArr[i].eventData.userId
          ) || 0) + 1
        );
      }
    }
  }

  #performTotalSpaceUsedAggregation() {
    let newArr = this.#fileterRelevantData(
      AggregationKeywords.TOTAL_SPACE_USED
    );
    for (let i = 0; i < newArr.length; i++) {
      this.aggragationResults.totalSpaceUsed.set(
        newArr[i].eventData.userId,
        (this.aggragationResults.totalSpaceUsed.get(
          newArr[i].eventData.userId
        ) || 0) + newArr[i].eventData.spaceInMb
      );
    }
  }
  getAggregation() {
    this.#performInstallCountUserAggregation();
    this.#performTotalSpaceUsedAggregation();
    return this.aggragationResults;
  }
}

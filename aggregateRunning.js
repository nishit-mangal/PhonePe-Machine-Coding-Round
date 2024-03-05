import { AggregationsMetadata } from "./constants.js";

let aggragationResults = {
  installCountUser: new Map(),
  totalSpaceUsed: new Map(),
};
export class AggregateRunning {
  currentTimestamp = 1706453111464;
  currEvent;
  // aggragationResults = {
  //   installCountUser: new Map(),
  //   totalSpaceUsed: new Map(),
  // };

  constructor(event) {
    if (!event) {
      throw "Invalid Input";
    }
    this.currEvent = event;
  }

  #performInstallCountUserAggregation() {
    if (
      this.currentTimestamp - parseInt(this.currEvent.timestamp) <
      AggregationsMetadata.INSTALL_COUNT_USER.timeInterval
    ) {
      if (
        this.currEvent.eventData.spaceInMb >
        AggregationsMetadata.INSTALL_COUNT_USER.filterRules[0].value
      ) {
        aggragationResults.installCountUser.set(
          this.currEvent.eventData.userId,
          (aggragationResults.installCountUser.get(
            this.currEvent.eventData.userId
          ) || 0) + 1
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
  getAggregation() {
    this.#performInstallCountUserAggregation();
    this.#performTotalSpaceUsedAggregation();
    return aggragationResults;
  }
}

import { AggregationsMetadata } from "./constants.js";

export class AggregateRunning {
  currentTimestamp = 1706453111464;
  currEvent;
  aggragationResults = {
    installCountUser: new Map(),
    totalSpaceUsed: new Map(),
  };

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
        this.aggragationResults.installCountUser.set(
          this.currEvent.eventData.userId,
          (this.aggragationResults.installCountUser.get(
            this.currEvent.eventData.userId
          ) || 0) + 1
        );
      }
    } else {
      this.aggragationResults.installCountUser = new Map();
    }
  }
  #performTotalSpaceUsedAggregation() {
    if (
      this.currentTimestamp - parseInt(this.currEvent.timestamp) <
      AggregationsMetadata.TOTAL_SPACE_USED.timeInterval
    ) {
      this.aggragationResults.totalSpaceUsed.set(
        this.currEvent.eventData.userId,
        (this.aggragationResults.totalSpaceUsed.get(
          this.currEvent.eventData.userId
        ) || 0) + this.currEvent.eventData.spaceInMb
      );
    } else {
      this.aggragationResults.totalSpaceUsed = new Map();
    }
  }
  getAggregation() {
    this.#performInstallCountUserAggregation();
    this.#performTotalSpaceUsedAggregation();
    return this.aggragationResults;
  }
}

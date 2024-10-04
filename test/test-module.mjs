import { describe, it } from "mocha";
import { expect } from "chai";
import * as _ from "../helper.mjs";

describe("Helper functions", function () {
  it("should output the correct results", () => {
    expect(_.calculateEndTime("11:00", 480)).to.equal("19:00");
  });

  it("should output the correct results", () => {
    expect(_.floorToMultipleOf(104.323129969331, 5)).to.equal(100);
    expect(_.floorToMultipleOf(104.323129969331, 12)).to.equal(96);
    expect(_.floorToMultipleOf(104.323129969331, 37)).to.equal(74);
  });
});

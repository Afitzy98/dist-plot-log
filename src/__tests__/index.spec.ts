import { logDistributionPlot } from "..";
import { estimatePDF, plotWithXAxis } from "../utils";

describe("estimatePDF", () => {
  it("should estimate PDF for a discrete dataset", () => {
    const data = [1, 2, 2, 3, 3, 3];
    const result = estimatePDF(data);

    expect(result).toHaveProperty("binCenters");
    expect(result).toHaveProperty("pdf");
    expect(result).toHaveProperty("xMin");
    expect(result).toHaveProperty("xMax");

    // For discrete data, xMin should be the floor of the min, xMax the ceiling of the max.
    expect(result.xMin).toBe(1);
    expect(result.xMax).toBe(3);
    expect(result.binCenters.length).toBe(3); // one bin per discrete value
    expect(result.pdf.length).toBe(3);
  });

  it("should estimate PDF for a continuous dataset", () => {
    const data = [0.1, 0.5, 1.2, 1.8, 2.5, 2.9, 3.2];
    const numBins = 5;
    const result = estimatePDF(data, numBins);

    expect(result).toHaveProperty("binCenters");
    expect(result.binCenters.length).toBe(numBins);
  });
});

describe("plotWithXAxis", () => {
  it("should output a chart and x-axis labels", () => {
    // Spy on console.log so we can inspect its calls
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const data = [0.1, 0.2, 0.3, 0.4, 0.5];
    // Use dummy xMin and xMax and an xLabelOffset of 5
    plotWithXAxis(data, 0, 10, { xLabelOffset: 5 });

    // Expect two console.log calls: one for the chart, one for the x-axis label.
    expect(logSpy).toHaveBeenCalledTimes(2);

    // Optionally, check that the second call (x-axis label) contains the expected numbers.
    const secondCall = logSpy.mock.calls[1][0];
    expect(secondCall).toContain("0.0");
    expect(secondCall).toContain("10.0");

    // Clean up the spy
    logSpy.mockRestore();
  });
});

describe("logDistributionPlot", () => {
  it("should log the title and chart output", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Use sample raw data for the full flow.
    const data = [1, 2, 3, 4, 5, 3, 2, 1];
    logDistributionPlot(data, "Test Title");

    // The function should log at least: a title, the chart, and x-axis labels.
    // Check that at least one of the logs contains the title.
    const calls = logSpy.mock.calls;
    const titleLogged = calls.some((call) => call[0].includes("Test Title"));
    expect(titleLogged).toBe(true);

    // We expect multiple calls (the actual number depends on the internal implementation).
    expect(calls.length).toBeGreaterThanOrEqual(3);

    logSpy.mockRestore();
  });
});

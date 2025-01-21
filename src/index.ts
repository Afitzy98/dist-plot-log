import { estimatePDF, plotWithXAxis, widenData } from "./utils";

/**
 * Demonstrate PDF estimation and plotting for a given dataset.
 *
 * @param rawData - The raw sampled data.
 * @param title - A title for the chart (default is "Estimated PDF from the data").
 */
export function logDistributionPlot(
  rawData: number[],
  title: string = "Estimated PDF from the data"
): void {
  console.log("\n" + title + "\n");
  const { pdf, xMin, xMax } = estimatePDF(rawData);

  // Directly use xMin and xMax from estimatePDF for labeling.
  plotWithXAxis(pdf, xMin, xMax, { xLabelOffset: 11 });
}

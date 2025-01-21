import { estimatePDF, plotWithXAxis, widenData } from "./utils";

/**
 * Demonstrate PDF estimation and plotting for a given dataset.
 *
 * @param rawData - The raw sampled data.
 * @param title - A title for the chart (default is "Estimated PDF from the data").
 * @param widenFactor - Factor by which to widen the plot horizontally (default is 4).
 */
export function logDistributionPlot(
  rawData: number[],
  title: string = "Estimated PDF from the data",
  widenFactor: number = 4
): void {
  console.log("\n" + title + "\n");
  const { binCenters, pdf } = estimatePDF(rawData);

  // Widen the PDF data for a wider chart.
  const widenedPdf: number[] = widenData(pdf, widenFactor);

  // Widen bin centers similarly to maintain alignment.
  const widenedBinCenters: number[] = widenData(binCenters, widenFactor);

  // Use the endpoints from the widened bin centers for the x-axis.
  const xAxisMin = widenedBinCenters[0];
  const xAxisMax = widenedBinCenters[widenedBinCenters.length - 1];

  // Pass the xLabelOffset parameter (adjust as needed) via options.
  plotWithXAxis(widenedPdf, xAxisMin, xAxisMax, { xLabelOffset: 10 });
}

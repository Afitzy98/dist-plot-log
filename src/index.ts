import * as asciichart from "asciichart";

import { AsciiChartOptions, PDFEstimation } from "./types";
import { smooth, widenData } from "./utils";

/**
 * Estimate the probability density function (PDF) from raw data using a histogram.
 *
 * If the data are discrete (all integer values) then a binWidth of 1 is used.
 *
 * @param data - Raw data points.
 * @param numBins - Number of bins for the histogram (optional).
 * @returns An object containing binCenters, estimated pdf values, and the overall x-range.
 */
function estimatePDF(data: number[], numBins?: number): PDFEstimation {
  const isDiscrete: boolean = data.every((v) => Number.isInteger(v));
  let dataMin = Math.min(...data);
  let dataMax = Math.max(...data);

  let binWidth: number;
  let bins: number[];

  if (isDiscrete) {
    dataMin = Math.floor(dataMin);
    dataMax = Math.ceil(dataMax);
    numBins = dataMax - dataMin + 1;
    binWidth = 1;
    bins = new Array(numBins).fill(0);
  } else {
    numBins = numBins || 20;
    binWidth = (dataMax - dataMin) / numBins;
    bins = new Array(numBins).fill(0);
  }

  // Count data points in each bin.
  data.forEach((value) => {
    let binIndex = Math.floor((value - dataMin) / binWidth);
    if (binIndex < 0) binIndex = 0;
    else if (binIndex >= bins.length) binIndex = bins.length - 1;
    bins[binIndex]++;
  });

  const totalCount = data.length;
  // Convert counts into density: density = count / (totalCount * binWidth)
  let pdf = bins.map((count) => count / (totalCount * binWidth));

  // Smooth the PDF for better visual appearance.
  pdf = smooth(pdf, 3);

  // Compute bin centers (to be used as x-axis tick marks).
  const binCenters: number[] = Array.from(
    { length: numBins },
    (_, i) => dataMin + (i + 0.5) * binWidth
  );

  return { binCenters, pdf, xMin: dataMin, xMax: dataMax };
}

/**
 * Plot an array of y-values using asciichart with custom x-axis labels.
 *
 * An optional xLabelOffset (number of spaces) can be provided via options to shift the left x-axis label.
 *
 * @param dataValues - The y-values (e.g., estimated PDF values).
 * @param xMin - The minimum x value for labeling.
 * @param xMax - The maximum x value for labeling.
 * @param options - Additional options for asciichart.
 */
function plotWithXAxis(
  dataValues: number[],
  xMin: number,
  xMax: number,
  options: AsciiChartOptions = {}
): void {
  // Set fixed y-axis limits for a tighter plot.
  const yMax: number = Math.max(...dataValues) * 1.05;
  const plotOptions = Object.assign(
    {
      height: 15,
      min: 0,
      max: yMax,
    },
    options
  );

  // Create and display the plot.
  const chart = asciichart.plot(dataValues, plotOptions);
  console.log(chart);

  // Determine the width of the chart.
  const chartLines = chart.split("\n");
  const chartWidth = Math.max(...chartLines.map((line) => line.length));

  // Use the xLabelOffset option (defaulting to 0) to add extra spaces before the left label.
  const xLabelOffset: number = options.xLabelOffset || 0;

  // Build an x-axis label line.
  const leftLabel = " ".repeat(xLabelOffset) + xMin.toFixed(1);
  const rightLabel = xMax.toFixed(1);
  let labelLine = " ".repeat(chartWidth);
  labelLine = leftLabel + labelLine.slice(leftLabel.length);
  const rightStart = chartWidth - rightLabel.length;
  labelLine = labelLine.slice(0, rightStart) + rightLabel;
  console.log(labelLine);
}

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

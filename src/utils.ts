import * as asciichart from "asciichart";

import { AsciiChartOptions, PDFEstimation } from "./types";

/**
 * Smooth an array of numbers using a simple moving average filter.
 * Default window size is 3.
 *
 * @param arr - Data to smooth.
 * @param window - Window size for averaging.
 * @returns The smoothed data.
 */
export function smooth(arr: number[], window: number = 1): number[] {
  if (window <= 1) return arr;
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    let sum = 0;
    let count = 0;
    // Compute indices using a symmetric window.
    for (
      let j = i - Math.floor(window / 2);
      j <= i + Math.floor(window / 2);
      j++
    ) {
      if (j >= 0 && j < arr.length) {
        sum += arr[j];
        count++;
      }
    }
    result.push(sum / count);
  }
  return result;
}

/**
 * Widen an array by linearly interpolating between elements.
 *
 * For a widening factor F, F-1 interpolated values are inserted between each pair.
 *
 * @param data - Original data array.
 * @param factor - Widening factor (must be >= 1). For example, factor=4 quadruples the length.
 * @returns The widened data array.
 */
export function widenData(data: number[], factor: number = 1): number[] {
  if (factor <= 1) return data;

  const widened: number[] = [];
  for (let i = 0; i < data.length - 1; i++) {
    const start = data[i];
    const end = data[i + 1];
    widened.push(start);
    // Insert (factor - 1) interpolated points between start and end.
    for (let j = 1; j < factor; j++) {
      const interpolated = start + ((end - start) * j) / factor;
      widened.push(interpolated);
    }
  }
  widened.push(data[data.length - 1]);
  return widened;
}

/**
 * Estimate the probability density function (PDF) from raw data using a histogram.
 *
 * If the data are discrete (all integer values) then a binWidth of 1 is used.
 *
 * @param data - Raw data points.
 * @param numBins - Number of bins for the histogram (optional).
 * @returns An object containing binCenters, estimated pdf values, and the overall x-range.
 */
export function estimatePDF(data: number[], numBins?: number): PDFEstimation {
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
export function plotWithXAxis(
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

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
 * @param factor - Widening factor (must be >= 1).
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
 * Resample (or interpolate) an array of numbers to a target length.
 *
 * @param data - The original data array.
 * @param targetLength - The desired number of data points.
 * @returns The resampled data array.
 */
function resampleData(data: number[], targetLength: number): number[] {
  if (data.length === targetLength) return data;
  const resampled: number[] = [];
  const scale = (data.length - 1) / (targetLength - 1);
  for (let i = 0; i < targetLength; i++) {
    const pos = i * scale;
    const low = Math.floor(pos);
    const high = Math.ceil(pos);
    if (low === high) {
      resampled.push(data[low]);
    } else {
      const weight = pos - low;
      resampled.push(data[low] * (1 - weight) + data[high] * weight);
    }
  }
  return resampled;
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
 * This version re-samples the data to a fixed width (e.g. 80 columns) so that the
 * plot always fits within most console windows. It then obtains the printed chart width,
 * and builds the x-axis label line using a character array for fine control over label placement.
 *
 * @param dataValues - The y-values (e.g., estimated PDF values).
 * @param xMin - The minimum x value for labeling.
 * @param xMax - The maximum x value for labeling.
 * @param options - Additional options for asciichart (e.g., xLabelOffset).
 */
export function plotWithXAxis(
  dataValues: number[],
  xMin: number,
  xMax: number,
  options: AsciiChartOptions = {}
): void {
  // Set a fixed width for resampling.
  const fixedWidth = 80;
  // Resample the data to a fixed number of columns.
  const resampledData = resampleData(dataValues, fixedWidth);

  // Set fixed y-axis limits without additional scaling.
  const yMax = Math.max(...resampledData);
  const plotOptions = Object.assign(
    {
      height: 15,
      min: 0,
      max: yMax,
    },
    options
  );

  // Create the plot using the resampled data.
  const chart = asciichart.plot(resampledData, plotOptions);
  console.log(chart);

  // Compute the actual chart width based on the printed output.
  const chartLines = chart.split("\n");
  const chartWidth = Math.max(...chartLines.map((line) => line.length));

  // Build the x-axis label line using a character array.
  let labelArr: string[] = new Array(chartWidth).fill(" ");

  // Insert the left label (xMin) at the specified xLabelOffset (or 0 if not provided).
  const leftLabelStr = xMin.toFixed(1);
  const xLabelOffset = options.xLabelOffset || 0;
  for (
    let i = 0;
    i < leftLabelStr.length && i + xLabelOffset < chartWidth;
    i++
  ) {
    labelArr[i + xLabelOffset] = leftLabelStr[i];
  }

  // Insert the right label (xMax) so that it ends at the rightmost position.
  const rightLabelStr = xMax.toFixed(1);
  const rightStart = chartWidth - rightLabelStr.length;
  for (
    let i = 0;
    i < rightLabelStr.length && rightStart + i < chartWidth;
    i++
  ) {
    labelArr[rightStart + i] = rightLabelStr[i];
  }

  console.log(labelArr.join(""));
}

/**
 * Represents the result of estimating a probability density function.
 */
export interface PDFEstimation {
  binCenters: number[];
  pdf: number[];
  xMin: number;
  xMax: number;
}

/**
 * Interface for additional options passed to the plot function.
 */
export interface AsciiChartOptions {
  height?: number;
  min?: number;
  max?: number;
  xLabelOffset?: number;
  // Other asciichart options can be added here.
}

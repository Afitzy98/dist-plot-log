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

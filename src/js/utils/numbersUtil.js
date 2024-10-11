export default function isDefinedNumber(num) {
  return num !== undefined && !Number.isNaN(num);
}

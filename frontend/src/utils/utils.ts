export function formatNumberToPeso(number : number){
  return `₱${number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
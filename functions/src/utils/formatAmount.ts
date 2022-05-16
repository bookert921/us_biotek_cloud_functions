export const formatAmount = (purchaseAmount: string): number => {
  const movedDecimalPlace = Number(purchaseAmount) * 100;
  const formattedAmount = Number(movedDecimalPlace.toString().split(".")[0]);
  return formattedAmount;
};

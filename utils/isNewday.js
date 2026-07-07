export const isNewDay = (lastTransactionDate) => {
  if (!lastTransactionDate) {
    return true;
  }

  const today = new Date();
  const lastDate = new Date(lastTransactionDate);

  return (
    today.getFullYear() !== lastDate.getFullYear() ||
    today.getMonth() !== lastDate.getMonth() ||
    today.getDate() !== lastDate.getDate()
  );
};
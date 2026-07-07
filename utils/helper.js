export const isNewDay = (lastDate) => {
  if (!lastDate) return true;

  const today = new Date();
  const last = new Date(lastDate);

  return (
    today.getFullYear() !== last.getFullYear() ||
    today.getMonth() !== last.getMonth() ||
    today.getDate() !== last.getDate()
  );
};

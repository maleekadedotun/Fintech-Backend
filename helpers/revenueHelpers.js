import Revenue from "../models/Revenue/Revenue.js";


export const recordRevenue = async ({
  type,
  amount,
  cost,
  reference,
  user,
}) => {
  const profit = amount - cost;

  return await Revenue.create({
    type,
    amount,
    cost,
    profit,
    reference,
    user,
  });
};
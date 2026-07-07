import Ledger from "../models/Ledger/Ledger.js";

export const createLedgerEntry = async ({
  user,
  transaction,
  reference,
  entryType,
  amount,
  balanceBefore,
  balanceAfter,
  narration,
}) => {
  return Ledger.create({
    user,
    transaction,
    reference,
    entryType,
    amount,
    balanceBefore,
    balanceAfter,
    narration,
  });
};
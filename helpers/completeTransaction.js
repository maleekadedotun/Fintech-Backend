import { emitWalletUpdate } from "../socket/socketEmitter.js";
import createNotification from "./createNotification.js";
import { recordRevenue } from "./revenueHelpers.js";
import { createLedgerEntry } from "./ledgerHelper.js";

const completeTransaction = async ({
    transaction,
    providerReference,
    sender,
    session,
    userId,
    amount,
    category,
    reference,
    narration,
    notificationTitle,
    notificationMessage,
}) => {

    transaction.status = "success";

    transaction.metadata.providerReference =
        providerReference;

    await transaction.save({ session });

    await session.commitTransaction();

    emitWalletUpdate(sender.wallet.user, {
        balance: sender.balanceAfter,
        accountNumber: sender.wallet.accountNumber,
    });

    await createNotification(
        userId,
        notificationTitle,
        notificationMessage
    );

    await recordRevenue({
        type: category,
        amount,
        cost: amount,
        reference,
        user: userId,
    });

    await createLedgerEntry({
        user: userId,
        reference,
        entryType: "debit",
        amount,
        balanceBefore: sender.balanceBefore,
        balanceAfter: sender.balanceAfter,
        narration,
    });

};

export default completeTransaction;
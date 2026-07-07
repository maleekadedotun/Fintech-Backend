// helpers/emitWalletChange.js

import Wallet from "../models/Wallet/Wallet.js";
import { emitWalletUpdate } from "../socket/socketEmitter.js";

/**
 * Fetches the latest wallet balance and emits it to the user.
*/
const emitWalletChange = async (userId) => {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) return;

    emitWalletUpdate(userId, {
        balance: wallet.balance,
        accountNumber: wallet.accountNumber,
    });
};

export default emitWalletChange;
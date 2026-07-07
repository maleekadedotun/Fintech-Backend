// socket/socketEmitter.js

import { getIO, getUserSocket } from "./socket.js";

/**
 * Generic emitter
*/

const emitToUser = (userId, event, payload) => {

    const io = getIO();

    if (!io) {
        console.log(
            "[Socket] Socket.IO is not initialized."
        );
        return false;
    }

    const socketId = getUserSocket(
        userId.toString()
    );

    if (!socketId) {
        console.log(
            `[Socket] User ${userId} is offline.`
        );
        return false;
    }

    io.to(socketId).emit(
        event,
        payload
    );

    console.log(
        `[Socket] Event "${event}" sent to user ${userId}`
    );

    return true;

};

/**
 * Emit notification
*/
export const emitNotification = (userId, notification) => {

    return emitToUser(
        userId,
        "notification",
        notification
    );

};

/**
 * Emit wallet update
 */
export const emitWalletUpdate = (userId, wallet) => {

    return emitToUser(
        userId,
        "walletUpdated",
        wallet
    );

};

/**
 * Emit transaction update
 */
export const emitTransactionUpdate = (userId, transaction) => {

    return emitToUser(
        userId,
        "transactionUpdated",
        transaction
    );

};

/**
 * Emit scheduled transfer update
 */
export const emitScheduledTransferUpdate = (userId, schedule) => {

    return emitToUser(
        userId,
        "scheduledTransferUpdated",
        schedule
    );

};

/**
 * Emit withdrawal update
 */
export const emitWithdrawalUpdate = (userId, withdrawal) => {

    return emitToUser(
        userId,
        "withdrawalUpdated",
        withdrawal
    );

};

/**
 * Emit admin dashboard update
 */
export const emitAdminDashboardUpdate = (data) => {

    const io = getIO();

    if (!io) {
        console.log(
            "[Socket] Socket.IO is not initialized."
        );
        return false;
    }

    io.emit(
        "adminDashboardUpdated",
        data
    );

    console.log(
        "[Socket] Admin dashboard updated."
    );

    return true;

};
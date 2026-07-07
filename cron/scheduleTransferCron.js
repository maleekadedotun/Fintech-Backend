import cron from "node-cron";
import { executeTransfer } from "../services/executeTransferService.js";
import ScheduledTransfer from "../models/schedule/scheduledTransfer.js";

// Run every minute
cron.schedule("* * * * *", async () => {
    console.log("Checking scheduled transfers...");

    try {
        // Find all transfers due for execution
        const transfers = await ScheduledTransfer.find({
            status: "active",
            nextRun: { $lte: new Date() },
        });

        if (transfers.length === 0) {
            return;
        }

        for (const transfer of transfers) {
            try {
                // Execute the transfer
                await executeTransfer({
                    senderUserId: transfer.user,
                    receiverAccountNumber: transfer.receiverAccountNumber,
                    amount: transfer.amount,

                    // Scheduled transfers don't require the user
                    // to enter their PIN every time.
                    transactionPin: null,
                });

                // Update next execution
                switch (transfer.frequency) {
                    case "once":
                        transfer.status = "completed";
                        break;

                    case "daily":
                        transfer.nextRun = new Date(
                            transfer.nextRun.getTime() + 24 * 60 * 60 * 1000
                        );
                        break;

                    case "weekly":
                        transfer.nextRun = new Date(
                            transfer.nextRun.getTime() + 7 * 24 * 60 * 60 * 1000
                        );
                        break;

                    case "monthly":
                        transfer.nextRun.setMonth(
                            transfer.nextRun.getMonth() + 1
                        );
                        break;

                    default:
                        console.log(
                            `Unknown frequency: ${transfer.frequency}`
                        );
                }

                await transfer.save();

                console.log(
                    `Scheduled transfer ${transfer.reference} processed successfully`
                );
            } catch (error) {
                console.error(
                    `Transfer ${transfer._id} failed:`,
                    error.message
                );
            }
        }
    } catch (error) {
        console.error(
            "Scheduled transfer cron error:",
            error.message
        );
    }
});

console.log("Scheduled Transfer Cron Started");
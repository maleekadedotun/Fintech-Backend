import cron from "node-cron";
import { executeTransfer } from "../services/executeTransferService.js";
import ScheduledTransfer from "../models/schedule/scheduledTransfer.js";

// On startup: reset any transfers stuck in "processing" from a previous crash
ScheduledTransfer.updateMany(
    { status: "processing" },
    { $set: { status: "active" } }
).then((r) => {
    if (r.modifiedCount > 0)
        console.log(`Reset ${r.modifiedCount} stuck processing transfer(s) to active`);
}).catch(console.error);

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
            // Atomically lock this transfer to "processing" so concurrent
            // cron ticks cannot pick it up and execute it a second time.
            const locked = await ScheduledTransfer.findOneAndUpdate(
                { _id: transfer._id, status: "active" },
                { $set: { status: "processing" } },
                { new: true }
            );

            // Another cron tick already grabbed this one — skip it.
            if (!locked) continue;

            try {
                // Execute the transfer
                await executeTransfer({
                    senderUserId: transfer.user,
                    receiverAccountNumber: transfer.receiverAccountNumber,
                    amount: transfer.amount,

                    // Scheduled transfers don't require the user
                    // to enter their PIN every time.
                    transactionPin: null,
                    isScheduled: true,
                });

                // Update next execution time or mark completed
                switch (transfer.frequency) {
                    case "once":
                        locked.status = "completed";
                        break;

                    case "daily": {
                        locked.status = "active";
                        // Advance from NOW so a stale transfer doesn't fire every minute
                        const next24h = new Date();
                        next24h.setDate(next24h.getDate() + 1);
                        locked.nextRun = next24h;
                        break;
                    }

                    case "weekly": {
                        locked.status = "active";
                        const next7d = new Date();
                        next7d.setDate(next7d.getDate() + 7);
                        locked.nextRun = next7d;
                        break;
                    }

                    case "monthly": {
                        locked.status = "active";
                        const nextMonth = new Date();
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        locked.nextRun = nextMonth;
                        break;
                    }

                    default:
                        locked.status = "active";
                        console.log(`Unknown frequency: ${transfer.frequency}`);
                }

                await locked.save();

                console.log(
                    `Scheduled transfer ${transfer._id} processed successfully`
                );
            } catch (error) {
                // Restore to "active" so it can be retried on the next tick
                await ScheduledTransfer.findByIdAndUpdate(transfer._id, {
                    $set: { status: "active" },
                });

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
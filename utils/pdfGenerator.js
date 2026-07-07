import PDFDocument from "pdfkit";
import path from "path";


export const generateStatementPDF = ({
    user,
    wallet,
    transactions,
    from,
    to,
}) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                margin: 50,
                size: "A4",
            });

            const buffers = [];

            doc.on("data", (chunk) => buffers.push(chunk));

            doc.on("end", () => {
                resolve(Buffer.concat(buffers));
            });

            // =====================
            // HEADER
            // =====================

            doc
                .fontSize(22)
                .text("My Fintech", {
                    align: "center",
                });

            doc.moveDown();

            doc
                .fontSize(18)
                .text("Account Statement", {
                    align: "center",
                });

            doc.moveDown(2);

            // =====================
            // CUSTOMER INFORMATION
            // =====================

            doc.fontSize(12);

            doc.text(`Name: ${user.name}`);

            doc.text(`Email: ${user.email}`);

            doc.text(`Account Number: ${wallet.accountNumber}`);

            doc.text(`Current Balance: ₦${wallet.balance.toLocaleString()}`);

            if (from && to) {
                doc.text(`Period: ${from} - ${to}`);
            }

            doc.moveDown(2);

            // =====================
            // TABLE HEADER
            // =====================

            const y = doc.y;

            doc.font("Helvetica-Bold");

            doc.text("Date", 50, y);

            doc.text("Time", 130, y);

            doc.text("Type", 220, y);

            doc.text("Category", 300, y);

            doc.text("Amount", 410, y);

            doc.text("Status", 500, y);

            // doc.text("Date", 50);
            // doc.text("Time", 140);
            // doc.text("Type", 220);
            // doc.text("Category", 300);
            // doc.text("Amount", 420);
            // doc.text("Status", 520);

            // doc.text("Date", 50);
            // doc.text("time", 560);


            // doc.text("Type", 170);

            // doc.text("Category", 260);

            // doc.text("Amount", 380);

            // doc.text("Status", 480);

            doc.moveDown();

            // doc.font("./font/DejaVuSans.ttf");
            // doc.font("Helvetica");

            const fontPath = path.join(process.cwd(), "font", "DejaVuSans.ttf");

            doc.font(fontPath);
            // doc.text("₦");

            // =====================
            // TRANSACTIONS
            // =====================

            transactions.forEach((transaction) => {

                const y = doc.y;

                const date = new Date(transaction.createdAt);

                doc.text(date.toLocaleDateString(), 50, y);

                doc.text(date.toLocaleTimeString(), 130, y);

                doc.text(transaction.type, 220, y);

                doc.text(transaction.category, 300, y);

                doc.text(`₦${transaction.amount.toLocaleString()}`, 410, y);
                // doc.text(`#${transaction.amount.toLocaleString()}`, 410, y);

                doc.text(transaction.status, 500, y);

                doc.moveDown();
                // const date = new Date(transaction.createdAt);

                // doc.text(date.toLocaleDateString(), 50);

                // doc.text(date.toLocaleTimeString(), 140);

                // doc.text(transaction.type, 220);

                // doc.text(transaction.category, 300);

                // doc.text(`₦${transaction.amount.toLocaleString()}`, 420);

                // doc.text(transaction.status, 520);

                // doc.moveDown();
                // doc.text(
                //     new Date(transaction.createdAt).toLocaleDateString(),
                //     50
                // );

                // doc.text(transaction.type, 170);

                // doc.text(transaction.category, 260);

                // doc.text(
                //     `₦${transaction.amount.toLocaleString()}`,
                //     380
                // );

                // doc.text(transaction.status, 480);

                // doc.text(transaction.time, 450);

                // doc.moveDown();
            });

            doc.moveDown(2);

            // =====================
            // FOOTER
            // =====================

            doc.fontSize(10);

            doc.text(
                `Generated on ${new Date().toLocaleString()}`,
                {
                    align: "center",
                }
            );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
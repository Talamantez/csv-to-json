import { parse } from "csv-parse";
import { stringify } from "csv-stringify";
import { transform } from "stream-transform";
import fs from "fs";

// Use stream.pipeline for proper backpressure handling and error propagation
async function readCSV() {
    const parser = fs
        .createReadStream("./cats.csv")
        // .pipe(parse({ delimiter: ",", from_line: 2 }));
        .pipe(
            parse({
                columns: true,
                skip_empty_lines: true,
                trim: true,
                // Avoid skip_records_with_error - validate and log errors instead
                relax_column_count: true,
            })
        )

    try {
        // Use async iterator pattern to process rows incrementally
        // This ensures proper backpressure handling and prevents memory build-up
        for await (const row of parser) {
            row.length = 17;
            console.log(row);
        }
        console.log("Finished reading CSV file");
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

readCSV().catch((error) => {
    console.error("Failed to read CSV:", error.message);
    process.exit(1);
});
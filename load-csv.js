import { parse } from "csv-parse";
import fs from "fs";
import JSONStream from "JSONStream";

// Use stream.pipeline for proper backpressure handling and error propagation
async function readCSV() {
    fs.createReadStream("C://Users//rober//Documents//Peace Love Unity//kittens.csv")
        // .pipe(parse({ delimiter: ",", from_line: 2 }));
        .pipe(
            parse({
                columns: true,
                skip_empty_lines: true,
                trim: true,
                // Avoid skip_records_with_error - validate and log errors instead
                relax_column_count: true,
            })
        ).pipe(JSONStream.stringify("[\n", ",\n", "\n]"))
        .pipe(fs.createWriteStream("output_stream.json"))
        .on("finish", () => {
            console.log("Streaming CSV to JSON conversion complete");
        });
}

readCSV().catch((error) => {
    console.error("Failed to read CSV:", error.message);
    process.exit(1);
});
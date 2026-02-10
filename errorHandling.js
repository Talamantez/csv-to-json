const fs = require("fs");
const { parse } = require("csv-parse");
const { pipeline } = require("stream/promises");

// Validate records and log errors with contextual information
function validateRecord(record, rowNumber) {
  const errors = [];
  
  if (!record.year_month) {
    errors.push(`Missing year_month at row ${rowNumber}`);
  } else if (!/^\d{4}-\d{2}$/.test(record.year_month)) {
    errors.push(`Invalid year_month format at row ${rowNumber}`);
  }
  
  if (!record.estimate) {
    errors.push(`Missing estimate at row ${rowNumber}`);
  } else {
    const estimate = parseInt(record.estimate, 10);
    if (isNaN(estimate) || estimate < 0) {
      errors.push(`Invalid estimate value at row ${rowNumber}`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

async function handleErrors() {
  let rowNumber = 0;
  let validCount = 0;
  let invalidCount = 0;
  
  // Use async iterator pattern for proper backpressure handling
  const parser = fs
    .createReadStream("./cats.csv")
    .pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true, // Allow inconsistent column counts
        // Avoid skip_records_with_error - validate and log errors instead
      })
    );

  try {
    for await (const record of parser) {
      rowNumber++;
      const validation = validateRecord(record, rowNumber);
      
      if (validation.isValid) {
        validCount++;
        // Process valid record
        console.log(`Valid record ${rowNumber}:`, record.year_month);
      } else {
        invalidCount++;
        // Log validation errors with contextual information for debugging
        console.warn(`Row ${rowNumber} validation failed:`, validation.errors.join("; "));
      }
    }
    
    console.log(`Processed ${validCount} valid records`);
    console.log(`Encountered ${invalidCount} invalid records`);
  } catch (error) {
    console.error("Parse error:", error.message);
    throw error;
  }
}

handleErrors().catch((error) => {
  console.error("Error handling failed:", error.message);
  process.exit(1);
});
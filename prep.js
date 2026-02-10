// input file
// interface Coords {
//     lat: number,
//     long: number
// }
import fs from 'fs';
import myData from "./output_stream.json" with { type: "json" };

const input = myData;

const output = [];

const report = {
    id: Number,
    name: String,
    date: String,
    city: String,
    location: String,
    coords: [Number, Number],
    address: String,
    time: String,
    activity: String,
    detained_estimate: Number,
    detained_confirmed: Number,
    details: String,
    krr_response: String,
    source: String,
    plate: String,
    make_model: String,
    color: String,
    tabs: String
}

// const input = {
//     "Id": "106049",
//     "Date": "12/21/2025",
//     "City": "Everett",
//     "Location": "",
//     "Long": "34343",
//     "Lat": "34",
//     "Address": "",
//     "Time": "",
//     "Activity": "Patrol",
//     "TD_Est": "0",
//     "TD_Conf": "0",
//     "Details": "",
//     "KRR_Response": "",
//     "Source": "",
//     "Plate": "CKK0097",
//     "Make_Model": "Nissan Rogue",
//     "Color": "Silver",
//     "Tabs": ""
// }

function processInput(obj) {
    const myReport = Object.create(report);
    // console.log(obj)
    const myCoords = new Array(2)
    Object.keys(obj).forEach(key => {
        // console.log(`${key}: ${obj[key]}`)
        if (key == "Id") {
            if (obj[key])
                myReport.id = obj[key]
        } else if (key == "Date") {
            if (obj[key])
                myReport.date = obj[key]
        } else if (key == "City") {
            if (obj[key])
                myReport.city = obj[key]
        } else if (key == "Location") {
            if (obj[key])
                myReport.location = obj[key]
        } else if (key == "Long") {
            myCoords[1] = obj[key];
            if (myCoords[0] && myCoords[1]) {
                myReport.coords = myCoords;
            }
        } else if (key == "Lat") {
            myCoords[0] = obj[key];
            if (myCoords[0] && myCoords[1]) {
                myReport.coords = myCoords;
            }
        } else if (key == "Address") {
            myReport.address = obj[key];
        } else if (key == "Time") {
            myReport.time = obj[key]
        } else if (key == "Activity") {
            myReport.activity == obj[key];
        } else if (key == "TD_Est") {
            myReport.detained_estimate = obj[key];
        } else if (key == "TD_Conf") {
            myReport.detained_confirmed = obj[key];
        } else if (key == "Details") {
            myReport.details = obj[key]
        } else if (key == "KRR_Response") {
            myReport.krr_response = obj[key]
        } else if (key == "Source") {
            myReport.source = obj[key]
        } else if (key == "Plate") {
            myReport.plate = obj[key]
        } else if (key == "Make_Model") {
            myReport.make_model = obj[key]
        } else if (key == "Color") {
            myReport.color = obj[key]
        } else if (key == "Tabs") {
            myReport.Tabs = obj[key]
        }
    });
    output.push(myReport)
}

for (let entry in input) {
    // console.log(entry)
    processInput(input[entry])
}


fs.writeFile("reports.json", JSON.stringify(output), (error) => {
    if (error) {
        console.log(error);
        throw error;
    }
    console.log("reports.json written correctly");
});

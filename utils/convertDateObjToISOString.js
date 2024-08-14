const config = require("../config/config");

module.exports = {
    convertDateObjToISOString: (dateObj) => {
        const alertTime = {
            day: dateObj.day,
            month: dateObj.month,
            year: dateObj.year,
            hour: dateObj.hour,
            minute: dateObj.minute,
            ampm: dateObj.ampm
        };

        // Convert to 24-hour format
        let hour24 = alertTime.hour;
        if (alertTime.ampm === 'PM' && alertTime.hour !== 12) {
            hour24 += 12;
        } else if (alertTime.ampm === 'AM' && alertTime.hour === 12) {
            hour24 = 0;
        }

        // Create a Date object
        const date = new Date(
            alertTime.year,
            alertTime.month - 1, // Months are 0-based in JavaScript Date
            alertTime.day,
            hour24,
            alertTime.minute
        );

        // Convert to ISO string
        let isoString = "";
        if(config.mode === "DEV"){
            isoString = date.toISOString();  // this is for dev mode
        }
        else if(config.mode === "PROD") {
            isoString = new Date(date.getTime() + ((-7 * 60) * 60000))// make it to UTC for production
        }
        
        return isoString;
    }
};

const axios = require("axios");
const moment = require("moment");
const { mapChannel } = require("./mapChannel");

async function sendLineAfterOpenBox(token, alertName, meal, time, date, channel){
    meal = meal == "BEFORE_MEAL" ? "ก่อนอาหาร" : "หลังอาหาร";
    time = ((await makeCurrentTimeToUTC7(new Date().getTime())).split("T")[1]).split(".000")[0];
    date = ((await makeCurrentTimeToUTC7(new Date().getTime())).split("T")[0]).split("-").reverse().join("/");
    channel = mapChannel(channel);
    try {
        await axios.post("https://notify-api.line.me/api/notify", `message=ผู้ป่วยได้ทานยา รายการ ${alertName} ประเภท ${meal} เมื่อเวลา ${time} น วันที่ ${date} จากช่อง ${channel} เเล้วนะครับ`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`,
            },
        });
    }
    catch(e){
        console.log(e);
    }
}

const makeCurrentTimeToUTC7 = async (currentTimeData) => {
    const utcDate = new Date(parseInt(currentTimeData.valueOf()));
    const options = { timeZone: 'Asia/Bangkok', hour12: false };
    const dateInUTC7 = utcDate.toLocaleString('en-US', options).replace(', ', 'T');
    const [datePart, timePart] = dateInUTC7.split('T');
    const splitDatePart = datePart.split("/");
    const splitTimePart = timePart.split(":");
    const makeLikeISOStringFormatInUTC7 = `${splitDatePart[2]}-${splitDatePart[0].length === 1 ? `0${splitDatePart[0]}` : splitDatePart[0]}-${splitDatePart[1].length === 1 ? `0${splitDatePart[1]}` : splitDatePart[1]}T${splitTimePart[0].length === 1 ? `0${splitTimePart[0]}` : splitTimePart[0]}:${splitTimePart[1]}:${splitTimePart[2]}.000+07:00`;
    return (makeLikeISOStringFormatInUTC7);
}

module.exports = {
    sendLineAfterOpenBox
}
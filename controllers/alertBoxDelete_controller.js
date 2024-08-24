const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const moment = require("moment");
const momentTz = require("moment-timezone");


async function AlertBoxDeleteController(req, res){
    const { alertUUID, boxKey } = req.body ?? {};

    if(!alertUUID || !boxKey){
        return res.json({
            status: "FAIL",
            message: "Missing data fields alertUUID or boxKey or both",
            error: {}
        });
    }

    try {
        const findBoxData = await prisma.box.findUnique({
            where: {
                box_key: boxKey,
            },
            select: {
                box_uuid: true,
                box_key: true,
                box_slot_count: true
            }
        });

        if(!findBoxData){
            return res.json({
                status: "FAIL",
                message: "Box not found",
                error: {}
            });
        }

        const findAlertData = await prisma.alertData.findUnique({
            where: {
                alert_uuid: alertUUID,
            },
            select: {
                alert_uuid: true,
            }
        });

        if(!findAlertData){
            return res.json({
                status: "FAIL",
                message: "Alert data not found",
                error: {}
            });
        }

        await prisma.alertData.delete({
            where: {
                alert_uuid: findAlertData.alert_uuid,
            }
        }); 

        return res.json({
            status: "OK",
            message: `Delete Alert UUID : ${findAlertData.alert_uuid} Success`,
            error: false
        }); 
    }
    catch(e){
        return res.json({
            status: "FAIL",
            message: "Something went wrong",
            error: e
        });
    }
}

module.exports = {
    AlertBoxDeleteController
}
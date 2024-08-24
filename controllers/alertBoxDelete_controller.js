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
    const { alertId, boxKey } = req.body ?? {};

    if(!alertId || !boxKey){
        return res.json({
            status: "FAIL",
            message: "Missing data fields alertId or boxKey or both",
            error: {}
        });
    }

    try {

        //  Validate Box
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

         //  Validate Alert Data
        const findAlertData = await prisma.alertData.findUnique({
            where: {
                id: alertId,
                box_uuid: findBoxData.box_uuid,
            },
            select: {
                alert_uuid: true,
                box_uuid: true
            }
        });

        if(!findAlertData){
            return res.json({
                status: "FAIL",
                message: "Alert data not found",
                error: {}
            });
        }

        //  Update Alert Data
        await prisma.alertData.update({
            where: {
                alert_uuid: findAlertData.alert_uuid,
                box_uuid: findAlertData.box_uuid
            },
            data: {
                is_disabled: true
            }
        }); 

        return res.json({
            status: "OK",
            message: `Update to disable mode : Success : Alert UUID : ${findAlertData.alert_uuid}`,
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
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/config");
const axios = require("axios");
const { getJwtFromBearerHeader } = require("../utils/getJwtFromBearerHeader");
const { verifyJwt } = require("../utils/verifyJwt");
const { convertDateObjToISOString } = require("../utils/convertDateObjToISOString");
const { isValidDate } = require("../utils/isValidDate");
const moment = require("moment");

async function BoxUpdateLineNotifyController(req, res){
    const { lineToken, boxUUID } = req.body ?? {};
    const { token } = req.cookies ?? {};

    if(!token){
        return res.json({
            status: "FAIL",
            message: "Require token",
            error: {},
        });  
    }

    if(!lineToken || !boxUUID){
        return res.json({
            status: "FAIL",
            message:  "Missing fields lineToken or boxUUID"
        });
    }

    // parseJwtToRealData
    const getTokenFronJwt = await verifyJwt(token);
    if(!getTokenFronJwt){
        return res.json({
            status: "FAIL",
            message: "Currupted User Token",
            error: {},
        });
    }

    try {
        // check user uuid
        const findUserData = await prisma.user.findUnique({
            where: {
                user_uuid: getTokenFronJwt.uuid
            },
            select: {
                user_uuid: true,
            }
        });

        if(!findUserData){
            return res.json({
                status: "FAIL",
                message: "User not found",
                error: {},
            });
        }

        // validate box uuid
        const findBoxInfo = await prisma.registeredBox.findUnique({
            where: {
                box_uuid: boxUUID,
                user_uuid: findUserData.user_uuid,
            },
            select: {
                id: true,
                box_uuid: true
            }
        });

        if(!findBoxInfo){
            return res.json({
                status: "FAIL",
                message: "Box not found",
                error: {}
            });
        }

        // Update Line notify
        await prisma.registeredBox.update({
            where: {
                user_uuid: findUserData.user_uuid,
                box_uuid: findBoxInfo.box_uuid,
            },
            data: {
                line_notify_token: lineToken,
            }
        });

        return res.json({
            status: "OK",
            message: "Update line notify token success",
            error: {}
        });
    }
    catch(e){
        console.log(e);
        return res.json({
            status: "FAIL",
            message: "Internal Server Error",
            error: e
        });
    }

}

module.exports = {
    BoxUpdateLineNotifyController
}
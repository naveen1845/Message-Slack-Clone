import { singUpService } from "../services/userService.js";
import { customErrorResponse } from "../utils/common/responseObjects.js";

export async function signUp(req, res) {
    try {
        console.log(req.body);
        
        const user = await singUpService(req.body);
        return res.status(200).json({
            success: true,
            message: 'user Created successfully',
            data: user
        })
    } catch (error) {
        console.log('user Controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error))
        }
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
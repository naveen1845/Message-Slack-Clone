import userRepository from "../repository/userRepository.js";
import ValidationError from "../utils/errors/ValidationError.js";

export const singUpService = async function(data) {
    try {
        const user = await userRepository.create(data);
        return user;
    } catch (error) {
        console.log('signup service error : ' , error);
        if (error.name === 'ValidationError') {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            )
        }
        if ( error.name === 'MongoServerError' && error.code === 11000){
            throw new ValidationError(
                {
                    error: ['User with same email or Username already exists']
                },
                'User with same email or Username already exists'
            )
        }
    }
}
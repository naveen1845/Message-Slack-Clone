import User from "../model/user.js";
import crudRepository from "./crudRepository.js";

const userRepository = {
    ...crudRepository(User)
}

export default userRepository;


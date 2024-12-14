import User from '../model/user.js';
import crudRepository from './crudRepository.js';

const userRepository = {
  ...crudRepository(User),

  getUserByEmail: async function (email) {
    const user = await User.findOne({ email });
    return user;
  }
};

export default userRepository;

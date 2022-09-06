const validator = require('validator');
const Profile = require('./Profile');
const main = require('framework');

const User = {
    createUser: (name, profile) => {
        if (Profile.validateProfile(profile)) {
            if (validator.isAlpha(name, 'pt-BR', { ignore: ' ' })) {
                return {
                    name: name,
                    profile: profile,
                    score: 5,
                    numPedidos: 0,
                }
            }
            throw new Error('Invalid profile data');
        } else {
            throw new Error('Invalid profile data');
        }
    },
    validateUser: (user) => {
        if (Profile.validateProfile(user.profile)) {
            if (validator.isAlpha(user.name, 'pt-BR', { ignore: ' ' })) {
                return true;
            }
        }
        return false;
    },
}

module.exports = User;
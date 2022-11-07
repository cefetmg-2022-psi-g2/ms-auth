const validator = require('validator');

const Profile = {
    createProfile: (username, password, email, dateBirth, phone, gender) => {
        if (validator.isAlphanumeric(username, 'pt-BR', {ignore: "_"}) &&
            validator.isEmail(email) &&
            validator.isNumeric(phone) && phone.length == 11 &&
            validator.isDate(dateBirth, {format: 'DD/MM/YYYY', }) &&
            password.length > 6 && password.length < 32) {
            if (gender.length === 1 && validator.isAlpha(gender)) {
                return {
                    username: username,
                    password: password,
                    email: email,
                    dateBirth: dateBirth,
                    phone: phone,
                    gender: gender,
                }
            }
        }
        console.log("a");
        throw new Error('Invalid profile data');
    },
    validateProfile: (profile) => {
        if (validator.isAlphanumeric(profile.username, 'pt-BR', {ignore: "_"}) &&
            profile.password.length > 6 && profile.password.length < 32 &&
            validator.isEmail(profile.email) &&
            validator.isMobilePhone(profile.phone) &&
            validator.isDate(profile.dateBirth, {format: 'DD/MM/YYYY'})) {
            if (profile.gender.length === 1 && validator.isAlpha(profile.gender)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Profile;
const Validator = require('validator')
const isEmpty = require('./is-empty')
const util = require('../services/util')

class ValidateLogin {

    validate(body) {
        let error = {}
        let data = {}
    
        if (!isEmpty(body)) {

            data.userName = !isEmpty(body.userName) ? body.userName : ''
            data.password = !isEmpty(body.password) ? body.password : ''

            if (Validator.isEmpty(data.userName)) {
                error = util.formatError('Nome não fornecido!');
            }

            if (Validator.isEmpty(data.password)) {
                error = util.formatError('Senha não fornecida!');
            }
        
        } else {
            error = util.formatError('Preencha todos os campos!');
        }
    
        return {
            error,
            isValid: isEmpty(error)
        }
    }
}

module.exports = new ValidateLogin();
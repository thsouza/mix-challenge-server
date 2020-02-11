const Validator = require('validator')
const isEmpty = require('./is-empty')
const util = require('../services/util')

class ValidateRegister {

    validate (body) {
        let error = {}
        let data = {}
    
        if (!isEmpty(body)) {
            
            data.userName = !isEmpty(body.userName) ? body.userName : ''
            data.password = !isEmpty(body.password) ? body.password : ''
    
            if (!Validator.isLength(data.userName, { min: 3, max: 30 })) {
                error = util.formatError('Nome deve ter entre 3 e 30 caracteres');
            }
    
            if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
                error = util.formatError('Nome deve ter entre 5 e 30 caracteres');
            }
    
        } else {
            error = util.formatError('Dados não fornecidos!');
        }
    
        return {
            error,
            isValid: isEmpty(error)
        }
    }

}

module.exports = new ValidateRegister();
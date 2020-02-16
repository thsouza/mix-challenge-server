const Validator = require('validator')
const isEmpty = require('./is-empty')
const util = require('../services/util')

class ValidateConfinement {

    validate (body) {
        let error = {}
        let data = {}
    
        if (!isEmpty(body)) {
            
            data.name            = !isEmpty(body.name) ? body.name : ''
            data.qtyBovine       = !isEmpty(body.qtyBovine) ? body.qtyBovine : ''
            data.qtyEquine       = !isEmpty(body.qtyEquine) ? body.qtyEquine : ''
            data.initConfinement = !isEmpty(body.initConfinement) ? body.initConfinement : ''
            data.endConfinement  = !isEmpty(body.endConfinement) ? body.endConfinement : ''
    
            if (!Validator.isLength(data.name, { min: 3, max: 30 })) {
                error = util.formatError('Nome deve ter entre 3 e 30 caracteres!');
            }

            if (Validator.isEmpty(data.initConfinement)) {
                error = util.formatError('Data inicial não fornecida!');
            }

            if (Validator.isEmpty(data.endConfinement)) {
                error = util.formatError('Data final não fornecida!');
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

module.exports = new ValidateConfinement();
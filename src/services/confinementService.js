/** Load input validation */
const validate = require('../validation/confinement')
const isEmpty = require('../validation/is-empty')
const util = require('./util')

/** Models */
const User = require('../models/User');
const Confinement = require('../models/Confinement');

class ConfinementService {

    /**
     * Realiza a gravação dos dados do confinamento
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async create (req, res, next) { 
        try {             
            const { error, isValid } = validate.validate(req.body);
            
            if (!isValid) {
                return util.resultError400(res, error);
            }

            if (!req.params.userId) {
                return util.resultError400(res, 'Usuário não fornecido!');
            }

            const user = await User.findById(req.params.userId);
                
            if (isEmpty(user)) {
                return util.resultError400(res, 'Usuário não encontrado!');
            }
            
            if (!user.admin) {
                return util.resultError400(res, 'Usuário não autorizado!');
            }

            const newConfinement = new Confinement(req.body);
            newConfinement.user  = user;
            
            await newConfinement.save();

            return util.resultSuccess(res, newConfinement);            
        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }

    /**
     * Realiza a alteração dos dados do confinamento (apenas user admin)
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update (req, res, next) {
        try {             
            const { error, isValid } = validate.validate(req.body);
            
            if (!isValid) {
                return util.resultError400(res, error);
            }

            if (!req.params.confinementId) {
                return util.resultError400(res, 'Id não fornecido!');
            }

            const newConfinement = await Confinement.findByIdAndUpdate(req.params.confinementId, req.body, { new: true });

            if (isEmpty(newConfinement)) {
                return util.resultError400(res, 'Confinamento não encontrado!');
            }
            
            return util.resultSuccess(res, newConfinement);
        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }

    /**
     * Realiza a exclusão de um confinamento
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async remove (req, res, next) {     
        try {             
            if (!req.params.confinementId) {
                return util.resultError400(res, 'Id não fornecido!');
            }

            const newConfinement = await Confinement.findByIdAndRemove(req.params.confinementId);

            if (isEmpty(newConfinement)) {
                return util.resultError400(res, 'Confinamento não encontrado!');
            }
            
            return util.resultSuccess(res);          
        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }

    /**
     * Retorna todos os confinamentos do usuário
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getByUser (req, res, next) {     
        try {  
            if (!req.params.userId) {
                return util.resultError400(res, 'Id do usuário não fornecido!');
            }

            const confinements = await Confinement.find({ user: req.params.userId });
            
            return util.resultSuccess(res, confinements);      
        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }

    /**
     * Retorna um confinamento pelo id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getAll (req, res, next) {     
        try {  
            const confinements = await Confinement.find();
            
            let arrResult = [];
            
            for (let i = 0; i < confinements.length; i++) {
                let record = {
                    _id: confinements[i]._id,
                    name: confinements[i].name,
                    qtyBovine: confinements[i].qtyBovine,
                    qtyEquine: confinements[i].qtyEquine,
                    initConfinement: util.dateFormatReverse(confinements[i].initConfinement),
                    endConfinement: util.dateFormatReverse(confinements[i].endConfinement),
                    initDate: util.dateFormat(confinements[i].initConfinement),
                    endDate: util.dateFormat(confinements[i].endConfinement)
                }

                arrResult.push(record);
            }
                
            return util.resultSuccess(res, arrResult);      
        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }

    /**
     * Retorna um confinamento pelo id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get (req, res, next) {     
        try {  
            if (!req.params.confinementId) {
                return util.resultError400(res, 'Id não fornecido!');
            }

            const confinement = await Confinement.findById(req.params.confinementId);
            
            return util.resultSuccess(res, confinement);      
        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }

    /**
     * Retorna os cálculos para o trato dos animais
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async treatment (req, res, next) {
        try {             
            if (!req.params.confinementId) {
                return util.resultError400(res, 'Id não fornecido!');
            }

            const confinement = await Confinement.findById(req.params.confinementId);

            if (isEmpty(confinement)) {
                return util.resultError400(res, 'Confinamento não encontrado!');
            }
            
            // Quantidade de dias de confinamento
            const qtyDays = Math.round((confinement.endConfinement-confinement.initConfinement)/(1000*60*60*24))
            
            // Declaração das variáveis
            let totalFeedBovine  = 0;
            let dayFeedBovine    = 0;
            let weightBovine     = 400;
            let arrDayFeedBovine = [];

            let totalFeedEquine  = 0;
            let dayFeedEquine    = 0;
            let weightEquine     = 200;
            let arrDayFeedEquine = [];

            // Realiza os cálculos de acordo com a quantidade de dias de confinamento
            for (let i = 0; i < qtyDays; i++) {
                // Bovinos
                dayFeedBovine    = weightBovine * 0.0005;  // Calcula a quantidade de ração diária no período
                totalFeedBovine += dayFeedBovine;          // Atribui a quantidade diária para totalização da quantidade de ração
                weightBovine    += 1.1;                    // Peso total estimado do animal ao fim do período
                arrDayFeedBovine.push(dayFeedBovine * confinement.qtyBovine); // Armazena em um array a quantidade total de ração utilizada por dia

                // Equinos
                dayFeedEquine    = weightEquine * 0.0005;  // Calcula a quantidade de ração diária no período
                totalFeedEquine += dayFeedEquine;          // Atribui a quantidade diária para totalização da quantidade de ração
                weightEquine    += 0.8;                    // Peso total estimado do animal ao fim do período
                arrDayFeedEquine.push(dayFeedEquine * confinement.qtyEquine);  // Armazena em um array a quantidade total de ração utilizada por dia
            }

            // Objeto com os dados dos bovinos
            const bovine = {
                weightBovine,
                totalFeed: totalFeedBovine * confinement.qtyBovine,
                arrDayFeedBovine
            }

            // Objeto com os dados dos equinos
            const equine = {
                weightEquine,
                totalFeed: totalFeedEquine * confinement.qtyEquine,
                arrDayFeedEquine
            }

            // Retorna as informações
            return util.resultSuccess(res, { confinement, qtyDays, bovine, equine, initDate: util.dateFormat(confinement.initConfinement), endDate: util.dateFormat(confinement.endConfinement) });            
        } catch (err) {
            util.resultError400(res, 'Ocorreu um erro desconhecido, tente novamente ou contate o suporte.');
            next(err);
        }
    }

}

module.exports = new ConfinementService()
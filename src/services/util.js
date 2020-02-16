var Util = new Object();

Util.formatError = function (message) {
    var error = {
        message,
        variant: 'error'
    }
    return error;
}

Util.formatWarning = function (message) {
    var warning = {
        message,
        variant: 'warning'
    }
    return warning;
}

Util.resultSuccess = (res, data) => {
    return res.status(200).json({
        success: true,
        result: {
            message: "Operação realizada com sucesso.",
            variant: 'success'
        },
        data
    });
}

Util.resultError400 = (res, error) => {
    return res.status(400).json({
        success: false,
        error,        
    });
}

Util.resultWarning400 = (res, error) => {
    return res.status(400).json({
        success: false,
        error,        
    });
}

Util.dateFormat = (stringDate) => {
    var data = new Date(stringDate);
        data.setDate(data.getDate() + 1);
    var dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

Util.dateFormatReverse = (stringDate) => {
    var data = new Date(stringDate);
        data.setDate(data.getDate() + 1);
    var dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return anoF+"-"+mesF+"-"+diaF;
}

module.exports = Util;
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

module.exports = Util;
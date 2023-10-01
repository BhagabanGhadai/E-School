//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

function isRequired(data) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data "]

        //checks if  transactionId is present
        if (!isValid(data.transactionId))
            error.push("transactionId is required")

        //checks if   orderId is present
        if (!isValid(data.orderId))
            error.push("orderId is required")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



module.exports = { isRequired, isValid }
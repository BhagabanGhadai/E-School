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

        //checks if  fingerprint is present
        if (!isValid(data.fingerprint))
            error.push("fingerprint is required")

    

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



module.exports = { isRequired, isValid }
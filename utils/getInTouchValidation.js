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
            return ["Please enter data to user registration"]

        //checks if name is present
        if (!isValid(data.name))
            error.push("name is required")

        //checks if message is present
        if (!isValid(data.message))
            error.push(" message is required")

               //check if email is present
               if (!isValid(data.email))
               error.push("email is required")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}




module.exports = { isRequired, isValid }
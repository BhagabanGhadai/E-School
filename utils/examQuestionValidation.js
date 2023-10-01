//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidRoles = function (exam_type) {
    return ['objective', 'subjective'].indexOf(exam_type) != -1      //checkValidation for the enum value which is does'nt exist
}
function isRequired(data) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to user registration"]

        //checks if exam_question is present
        if (!isValid(data.exam_question))
            error.push("exam_question is required")

        //checks if exam_type is present
        if (!isValid(data.exam_type))
            error.push("exam_type is required")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}

module.exports = { isRequired, isValid,isValidRoles }
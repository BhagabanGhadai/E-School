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
            return ["Please enter data to create quiz"]

        //checks if  faq_question is present
        if (!isValid(data.faq_question))
            error.push("faq_question is required")

        //checks if   faq_answer is present
        if (!isValid(data.faq_answer))
            error.push("faq_answer is required")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



module.exports = { isRequired, isValid }
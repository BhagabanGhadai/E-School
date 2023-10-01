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
            return ["Please enter data to quiz Answer registration"]

        //checks if  quiz_answer is present
        if (!isValid(data.quiz_answer))
            error.push("quiz_answer is required")


    

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



function isInvalid(data,  ) {
    try {
        let error = []
        //checks for valid quiz_question
        if (typeof data.quiz_answer == "string" && !(/^[a-zA-Z]+$/.test(data.quiz_question?.trim())))
            error.push("enter a valid quiz_answer")


   

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
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
            return ["Please enter data to quiz registration"]

        //checks if  quiz_question is present
        if (!isValid(data.quiz_question))
            error.push("quiz_question is required")


    

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



function isInvalid(data) {
    try {
        let error = []
        //checks for valid quiz_question
        if (typeof data.quiz_question == "string" && !(/^[a-zA-Z]+$/.test(data.quiz_question?.trim())))
            error.push("enter a valid quiz_question")


            // if (typeof data. chapter_name == "string" && !(/^[a-zA-Z]+$/.test(data.chapter_name?.trim())))
            // error.push("enter a valid chapter_name")

   

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
// const isValidObjectId = function (objectId) {
//     return mongoose.Types.ObjectId.isValid(objectId)
// // }

function isRequired(data,pdf) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to course  registration"]

        //checks if  notes_name is present
        if (!isValid(data.notes_name))
            error.push("notes_name is required")

        //check if pdf file is present
        if (pdf.length == 0)
            error.push("pdf file is required")


    

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



function isInvalid(data,  pdf) {
    try {
        let error = []
        //checks for valid notes_name
        if (typeof data. notes_name == "string" && !(/^[a-zA-Z]+$/.test(data.notes_name?.trim())))
            error.push("enter a valid notes_name")


        //check for pdf file
        if (pdf.length > 0 && !(/pdf\/[a-z]+/.test(pdf[0].mimetype)))
            error.push("upload a valid pdf file")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
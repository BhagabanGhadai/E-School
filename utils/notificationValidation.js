//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

function isRequired(data,image) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to notification"]

        //checks if  title is present
        if (!isValid(data.title))
            error.push("title is required")

       //checks if  description is present
            if (!isValid(data.description))
            error.push("description is required")

        //check if image file is present
        if (image.length == 0)
            error.push("image file is required")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}




module.exports = { isRequired, isValid }
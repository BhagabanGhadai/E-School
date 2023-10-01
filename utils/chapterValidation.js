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
            return ["Please enter data to course  registration"]

        //checks if  chapter_name is present
        if (!isValid(data.chapter_name))
            error.push("chapter_name is required")

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



function isInvalid(data,  image) {
    try {
        let error = []
        //checks for valid chapter_name
        if (typeof data. chapter_name == "string" && !(/^[a-zA-Z]+$/.test(data.chapter_name?.trim())))
            error.push("enter a valid chapter_name")


        //check for image file
        if (image.length > 0 && !(/image\/[a-z]+/.test(image[0].mimetype)))
            error.push("upload a valid image file")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
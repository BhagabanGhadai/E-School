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

        //checks if  university is present
        if (!isValid(data.university))
            error.push("university is required")


            //checks if  short_description is present
            if (!isValid(data.short_description))
            error.push("short_description is required")

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
        //checks for valid student_university
        if (typeof data.university == "string" && !(/^[a-zA-Z]+$/.test(data.university?.trim())))
            error.push("enter a valid university")

  //checks for valid short_description
  if (typeof data.short_description == "string" && !(/^[a-zA-Z]+$/.test(data.short_description?.trim())))
  error.push("enter a valid short_description")
 
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
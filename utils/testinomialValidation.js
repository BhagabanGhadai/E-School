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

        //checks if  name is present
        if (!isValid(data.name))
            error.push("name is required")

             //checks if  rank is present
        if (!isValid(data.rank))
        error.push("rank is required")

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



function isInvalid(data,  image) {
    try {
        let error = []
        //checks for valid student_name
        if (typeof data.name == "string" && !(/^[a-zA-Z]+$/.test(data.name?.trim())))
            error.push("enter a valid name")

 //checks for valid name
 if (typeof data.rank == "string" && !(/^[a-zA-Z]+$/.test(data.rank?.trim())))
 error.push("enter a valid rank")
  //checks for valid description
  if (typeof data.description == "string" && !(/^[a-zA-Z]+$/.test(data.description?.trim())))
  error.push("enter a valid description")
 
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
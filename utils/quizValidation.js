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
            return ["Please enter data to create quiz"]

        //checks if  quiz_title is present
        if (!isValid(data.quiz_title))
            error.push("quiz_title is required")

        //checks if   short_description is present
        if (!isValid(data.short_description))
            error.push("short_description is required")


        //check if image file is present
        if (image.length == 0)
            error.push("image file is required")
             //check if correct_mark file is present
        if (correct_mark.length == 0)
        error.push("correct_mark file is required")
         //check if correct_mark file is present
         if (incorrect_mark.length == 0)
         error.push("incorrect_mark file is required")

            //check if  mrp is present
        if (!isValid(data.mrp))
        error.push(" mrp is required")


    

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



function isInvalid(data,image) {
    try {
        let error = []
        //checks for valid quiz_title
        if (typeof data.quiz_title == "string" && !(/^[a-zA-Z]+$/.test(data.quiz_title?.trim())))
            error.push("enter a valid quiz_title")

        //checks for valid    short_description
        if (typeof data.   short_description == "string" && !(/^[a-zA-Z]+$/.test(data.short_description?.trim())))
            error.push("enter a valid short_description")

      //checks for valid detail_description

      if (typeof data.detail_description == "string" && !(/^[a-zA-Z]+$/.test(data.detail_description?.trim())))
      error.push("enter a valid last name")

       //checks for valid highlights

       if (typeof data.highlights == "string" && !(/^[a-zA-Z]+$/.test(data.highlights?.trim())))
       error.push("enter a valid highlights")



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
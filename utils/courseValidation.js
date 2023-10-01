//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

function isRequired(data,thumbnail) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to course  registration"]

        //checks if  course_title is present
        if (!isValid(data.course_title))
            error.push("course_title is required")

        //checks if    short_description is present
        if (!isValid(data.short_description))
            error.push("short_description is required")

        //check if detail_description is present
        if (!isValid(data.detail_description))
            error.push("detail_description is required")

        //check if image file is present
        if (thumbnail.length == 0)
            error.push("image file is required")

        //checks if highlights is present or not
        if (!isValid(data.highlights))
            error.push("  highlights  is required")

        //check if  price is present
        if (!isValid(data.price))
            error.push(" price is required")

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



function isInvalid(data,  thumbnail) {
    try {
        let error = []
        //checks for valid course_title
        if (typeof data. course_title == "string" && !(/^[a-zA-Z]+$/.test(data.course_title?.trim())))
            error.push("enter a valid course_title")

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
        if (thumbnail.length > 0 && !(/image\/[a-z]+/.test(thumbnail[0].mimetype)))
            error.push("upload a valid image file")

         //checks for valid price
        if (typeof data.price == "string" && !(/^([0-9]+)?.?([0-9])+$/.test(data.price?.trim())))
        error.push("enter valid price")

          //checks for valid mrp
          if (typeof data.mrp == "string" && !(/^([0-9]+)?.?([0-9])+$/.test(data.mrp?.trim())))
          error.push("enter valid mrp")


        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
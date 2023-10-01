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
            return ["Please enter data to user registration"]

  //check if title is present
        if (!isValid(data.title))
         error.push("title is required")
   
       
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
    
  //checks for valid title
  if (typeof data.title == "string" && !(/^[a-zA-Z]+$/.test(data.title?.trim())))
  error.push("enter a valid title")
  if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}

module.exports = { isRequired, isInvalid, isValid}
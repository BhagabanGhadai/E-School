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

        //checks if name is present
        if (!isValid(data.name))
            error.push("first name is required")


               //check if email is present
               if (!isValid(data.email))
               error.push("email is required")
   
   
           //checks if phone is present or not
           if (!isValid(data.phone))
               error.push("phone number is required")

    

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
        //checks for valid name
        if (typeof data.name == "string" && !(/^[a-zA-Z]+$/.test(data.name?.trim())))
            error.push("enter a valid  name")


        //validate email
        if (typeof data.email == "string" && !(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email?.trim())))
            error.push("enter a valid email")
        //check for duplicate email
        if (getEmail)
            error.push("email is already in use")

        //checks for valid phone number
        if (typeof data.phone == "string" && !(/^((\+91)?0?)?[6-9]\d{9}$/.test(data.phone.trim())))
            error.push("enter valid mobile number")

        if (typeof data.phone == "string" && (/^((\+91)?0?)?[6-9]\d{9}$/.test(data.phone.trim())))
            data.phone = data.phone.trim().slice(-10)

        //check unique phone number
        if (getPhone)
            error.push("mobile number is already in use")
      

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
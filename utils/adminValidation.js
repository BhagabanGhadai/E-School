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

    
               //check if email is present
               if (!isValid(data.email))
               error.push("email is required")
   
   
         

                //check if password is present
           if (!isValid(data.password))
           error.push("password is required")

    

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
      


        //validate email
        if (typeof data.email == "string" && !(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email?.trim())))
            error.push("enter a valid email")
        //check for duplicate email
        if (getEmail)
            error.push("email is already in use")



        if (typeof data.password == "string" && (/[ ]+/.test(data.password)) || /^$/.test(data.password))
            error.push("enter valid password")
        //checks password length

        if (data.password?.trim() && (data.password.length < 8 || data.password.length > 15))
            error.push("password must have 8-15 characters")

              //checks confirm_password length

        if (confirm_password?.trim() && (confirm_password.length < 8 || confirm_password.length > 15))
        error.push("password must have 8-15 characters")
    
      

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
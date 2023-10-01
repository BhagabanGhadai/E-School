//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidGender = function (gender) {
    return ["Male", "Female"].indexOf(gender) != -1      //checkValidation for the enum value which is does'nt exist
}

function isRequired(data) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to user registration"]

        //checks if first_name is present
        if (!isValid(data.first_name))
            error.push("first name is required")

        //checks if last_name is present
        if (!isValid(data.last_name))
            error.push("last name is required")

               //check if email is present
               if (!isValid(data.email))
               error.push("email is required")
   
           //check if image thumbnail is present
           if (thumbnails.length == 0)
               error.push("image thumbnail is required")
   
           //checks if phone is present or not
           if (!isValid(data.phone))
               error.push("phone number is required")
   
         

                //check if password is present
           if (!isValid(data.password))
           error.push("password is required")

             //check if confirm_password is present
             if (!isValid(data.confirm_password))
             error.push("confirm_password is required")

                 //check if gender is present
           if (!isValid(data.gender))
           error.push("gender is required")

    

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
        //checks for valid first_name
        if (typeof data.first_name == "string" && !(/^[a-zA-Z]+$/.test(data.first_name?.trim())))
            error.push("enter a valid first name")

        //checks for valid last_name
        if (typeof data.last_name == "string" && !(/^[a-zA-Z]+$/.test(data.last_name?.trim())))
            error.push("enter a valid last name")

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

        if (typeof data.password == "string" && (/[ ]+/.test(data.password)) || /^$/.test(data.password))
            error.push("enter valid password")
        //checks password length

        if (data.password?.trim() && (data.password.length < 8 || data.password.length > 15))
            error.push("password must have 8-15 characters")

              //checks confirm_password length

        if (confirm_password?.trim() && (confirm_password.length < 8 || confirm_password.length > 15))
        error.push("password must have 8-15 characters")
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


module.exports = { isRequired, isInvalid, isValid,isValidGender }
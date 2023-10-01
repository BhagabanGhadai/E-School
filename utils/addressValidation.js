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
            return ["Please enter data to course  registration"]

        //checks if  name is present
        if (!isValid(data.name))
            error.push("name is required")

        //checks if  phone is present
        if (!isValid(data.phone))
            error.push("phone is required")

        //check if address is present
        if (!isValid(data.address))
            error.push("address is required")

        //checks if city is present or not
        if (!isValid(data.city))
            error.push("  city  is required")

        //check if  state is present
        if (!isValid(data.state))
            error.push(" state is required")

            //check if  country is present
        if (!isValid(data.country))
        error.push(" country is required")

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
            error.push("enter a valid name")

             //checks for valid phone number
        if (typeof data.phone == "string" && !(/^((\+91)?0?)?[6-9]\d{9}$/.test(data.phone.trim())))
        error.push("enter valid mobile number")

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).send({ status: false, message: "plz enter valid pincode" });
        }

      //checks for valid address

      if (typeof data.address == "string" && !(/^[a-zA-Z]+$/.test(data.address?.trim())))
      error.push("enter a valid last name")

       //checks for valid city
         if (typeof data.city == "string" && !(/^[a-zA-Z]+$/.test(data.city?.trim())))
         error.push("enter a valid city")

         //checks for valid state
        if (typeof data.state == "string" && !(/^([0-9]+)?.?([0-9])+$/.test(data.state?.trim())))
        error.push("enter valid state")

          //checks for valid country
          if (typeof data.country == "string" && !(/^([0-9]+)?.?([0-9])+$/.test(data.country?.trim())))
          error.push("enter valid country")


        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err })
    }
}


module.exports = { isRequired, isInvalid, isValid }
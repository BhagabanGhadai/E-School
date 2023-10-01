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
            return ["Please enter data to quiz Answer registration"]

        //checks if  exam_name is present
        if (!isValid(data.exam_name))
            error.push("exam_name is required")

              //checks if  description is present
        if (!isValid(data.description))
        error.push("description is required")

          //checks if  syllabus is present
          if (!isValid(data.syllabus))
          error.push("syllabus is required")

            //checks if  question_format is present
        if (!isValid(data.question_format))
        error.push("question_format is required")

          //checks if  course_duration is present
          if (!isValid(data.course_duration))
          error.push("course_duration is required")

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}

module.exports = { isRequired, isValid }
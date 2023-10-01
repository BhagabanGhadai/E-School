// //check Validity
// const isValid = (value) => {
//     if (typeof value === 'undefined' || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false
//     return true
// }
// // const isValidObjectId = function (objectId) {
// //     return mongoose.Types.ObjectId.isValid(objectId)
// // // }

function isRequired(data,video) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to course  registration"]

        //checks if video_name is present
        if (!isValid(data.video_name))
            error.push("video_name is required")

        //check if video file is present
        if (video.length == 0)
            error.push("video file is required")


    

        if (error.length > 0)
            return error
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



// function isInvalid(data,video) {
//     try {
//         let error = []
//         //checks for validvideo_name
//         if (typeof data.video_name == "string" && !(/^[a-zA-Z]+$/.test(data.video_name?.trim())))
//             error.push("enter a valid video_name")


//         //check for video file
//         if (video.length > 0 && !(/video\/[a-z]+/.test(video[0].mimetype)))
//             error.push("upload a valid video file")

//         if (error.length > 0)
//             return error
//     }
//     catch (err) {
//         console.log({ status: false, message: err })
//     }
// }


module.exports = { isRequired}
// module.exports={isRequired,  isValid}
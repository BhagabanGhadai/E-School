const quizResultModel = require("../models/quizResultModel");
const quizModel = require("../models/quizModel");
const userModel = require("../models/userModel");
const quizAnsModel = require("../models/quizAnsModel");
const quizQuesModel = require("../models/quizQuesModel");




const mongoose = require("mongoose");
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Adding quiz Result Add] --------------------------------------------------//


const quizResultAdd = async function (req, res) {
  try {
    const data = req.body;
    const quiz_slug = data.quiz_slug;
    const userId = data.userId;

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid user Id" });
    }

    // Check if the user has already submitted quiz result
    const existingResult = await quizResultModel.findOne({ userId, quiz_slug });

    if (existingResult) {
      return res.status(400).send({ status: false, message: "You have already submitted" });
    }

  
    let user = await userModel.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    const quiz = await quizModel.findOne({ quiz_slug: quiz_slug, isDeleted: false }).lean();

    if (!quiz) {
      return res.status(404).send({ status: false, message: "Quiz not found" });
    }

    const quizId = quiz._id;

    
    const quizAnswers = await quizAnsModel.find({ quizId });

    let totalMarks = 0;

    if (Array.isArray(data.answer)) {
      for (let i = 0; i < data.answer.length; i++) {
        const answerId = data.answer[i].answerId;

       
        const answer = quizAnswers.find(a => String(a._id) === String(answerId));

        if (answer && answer.isCorrect) {
          totalMarks += 4; 
        }
      }
    } else {
      return res.status(400).send({ status: false, message: "Invalid answer format" });
    }

   
    totalMarks += 4;

    
    data.total_marks = totalMarks;

    const created = await quizResultModel.create({ ...data, quizId });

    res.status(201).send({
      status: true,
      message: "Quiz result created successfully",
      total_marks: totalMarks
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};




//------------------------------------------answerCheck----------------------------

 
const answerCheck = async function (req, res) {
  try {
    const data = req.body;
    const quiz_slug = req.body.quiz_slug;
    const userId = req.body.userId;
    const answerId = req.body.answerId;

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid user Id" })
    }

    // Check if answerId is present in the quizAnsModel
    const quizAnswer = await quizAnsModel.findOne({ _id: answerId });

    if (!quizAnswer) {
      return res.status(404).send({ status: false, message: "Answer not found" });
    }

    // Check if the answer is correct and add right:1 to data
    if (quizAnswer.isCorrect) {
      const response = {
        status: true,
        message: "Answer is correct",
        right: 1,
      };
      return res.status(200).send(response);
    } else {
      const response = {
        status: true,
        message: "Answer is incorrect",
        right: 0,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



// //------------------------------------------------- API-2 [/get by id] --------------------------------------------------//
const getquizResultById = async (req, res) => {
    try {
        const data = req.body.quizResultId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild quizResultId" })
        }
        //find the quizResultId which is deleted key is false--
        let quizResult = await quizResultModel.findOne({ _id: data, isDeleted: false })

        if (!quizResult) {
            return res.status(404).send({ status: false, message: "No quizResultId Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data:quizResult })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}
// //--------------------------------------------------------- Update Quiz result -------------------------------------------------------//

const updatequizResult = async function (req, res) {
    try {

      
        const { quizResultId} = req.body;
    
        const data = {
            answer:req.body.answer,
        }
      
    const updatedData = await quizResultModel.findOneAndUpdate({ _id:quizResultId}, data ,{ new: true });
     
   
    return res.status(201).json({ data:updatedData })

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}

//------------------------------------ Delete Quiz Question ----------------------------------


const deleteQuizResult = async (req, res) => {

    try {
      let id = req.body.quizResultId
  
  
  //check wheather objectId is valid or not--
      if (!isValidObjectId(id)) {
  
        return res.status(400).send({ status: false, message: "please enter valid quiz Anstion id" })
      }
  
      const findquizResult = await quizResultModel.findOne({ _id:id, isDeleted: false })
  
  
      if (!findquizResult) {
        return res.status(404).send({ status: false, message: 'No quiz Result found' })
      }
  
      await quizResultModel.findOneAndUpdate({ _id: id },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true })
      return res.status(200).send({ status: true, message: "Quiz result deleted sucessfully" })
    }
    catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: "error", msg: err.message })
    }
  }

  // //------------------------------------------------- [/calculate total marks] --------------------------------------------------//


  const totalMarks = async function (req, res) {
    try {
      const quizId = req.body.quizId;
      const userId = req.body.userId;
  
      let quizResult = await quizResultModel.findOne({ userId: userId, quizId: quizId, isDeleted: false });
  
      if (!quizResult) {
        return res.status(404).send({ status: false, message: "Quiz result not found for user" });
      }
  
      let obtain_marks = 0;
      let total_marks = 0; 
      for (let ans of quizResult.answer) {
        let quizAns = await quizAnsModel.findOne({ quizAnsId: mongoose.Types.ObjectId(ans.answerId), quizQuesId: mongoose.Types.ObjectId(ans.quizQuesId) });
        if (quizAns && quizAns.isCorrect === true) {
          obtain_marks += 4;
        }
        total_marks += 4; 
      }
  
      res.status(200).send({
        status: true,
        message: "Total marks obtained by user",
        obtain_marks: obtain_marks,
        total_marks: total_marks 
      });
    }
    catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };

    // //------------------------------------------------- [/calculate total marks by quiz slug] --------------------------------------------------//


    const totalMarksByQuizSlug = async function (req, res) {
      try {
        const quiz_slug = req.body.quiz_slug;
        const userId = req.body.userId;
    
        let quiz = await quizModel.findOne({ quiz_slug: quiz_slug });
        if (!quiz) {
          return res.status(404).send({ status: false, message: "Quiz not found" });
        }
        
        let quizResult = await quizResultModel.findOne({ userId: userId, quizId: quiz._id, isDeleted: false });
            
        if (!quizResult) {
          return res.status(404).send({ status: false, message: "Quiz result not found for user" });
        }
    
        let obtain_marks = 0;
        let total_marks = 0; 
        for (let ans of quizResult.answer) {
          let quizAns = await quizAnsModel.findOne({ quizAnsId: mongoose.Types.ObjectId(ans.answerId), quizQuesId: mongoose.Types.ObjectId(ans.quizQuesId) });
          if (quizAns && quizAns.isCorrect === true) {
            obtain_marks += 4;
          }
          total_marks += 4; 
        }
    
        res.status(200).send({
          status: true,
          message: "Total marks obtained by user",
          obtain_marks: obtain_marks,
          total_marks: total_marks 
        });
      }
      catch (error) {
        res.status(500).send({ status: false, message: error.message });
      }
    };
// -------------------------------------------quiz Details---------------------------------
const quizDetails = async function (req, res) {
  try {
    const quizId = req.body.quizId;

    let quizResults = await quizResultModel.find({ quizId: quizId, isDeleted: false })
      .populate('quizId')
      .populate('userId', 'full_name phone');

    if (quizResults.length === 0) {
      return res.status(404).send({ status: false, message: "Quiz results not found for the given quizId" });
    }

    const quiz = quizResults[0].quizId; 

    const quizDetails = {
      quiz_title: quiz.quiz_title,
      short_description: quiz.short_description,
      image: quiz.image
    };

    const userDetails = quizResults.map(quizResult => {
      const user = quizResult.userId; 
      return {
        full_name: user.full_name,
        phone: user.phone
      };
    });

    res.status(200).send({
      status: true,
      quizDetails: quizDetails,
      userDetails: userDetails
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};







  
module.exports = {quizResultAdd,answerCheck,getquizResultById,updatequizResult,deleteQuizResult,totalMarks,totalMarksByQuizSlug,quizDetails}
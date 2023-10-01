const express= require("express")
const bodyParser= require("body-parser")


const userroute= require("./routes/userRoute");
const courseroute= require("./routes/courseRoute");
// const chapterroute= require("./routes/chapterRoute");
const chapterroutev2= require("./routes/chapterV2Route");
const coursesubjectroute= require("./routes/courseSubjectRoute");
const notesubjectroute= require("./routes/noteSubjectRoute");
const mocksubjectroute= require("./routes/mockSubjectRoute");
const mockcourseroute= require("./routes/mockCourseRoute");




// const notesroute = require("./routes/notesRoute");
const notesroutev2 = require("./routes/notesV2Route");

// const quizroute = require('./routes/quizV2Route');
// const quizroute = require('./routes/quizRoute');

// const quizQuesroute = require('./routes/quizQuestionV2Route');
// const quizQuesroute = require('./routes/quizQuesRoute');

// const quizAnsroute = require('./routes/quizAnsRoute');
// const videoroute = require("./routes/videoRoute");
const mankavitroute = require("./routes/whyMankavitRoute");
const newsletterroute = require("./routes/newsLetterRoute");
const examroute = require("./routes/examRoute");
const achiversroute = require("./routes/achiverRoute");
const testinomialroute = require("./routes/testinomialRoute")
const faqroute =require("./routes/faqRoute")
const facultyroute =require("./routes/facultyRoute")
const facultydegreeroute =require("./routes/facultyDegreeRoute")
const coursebatchroute =require("./routes/courseBatchRoute")
const coursebatchhightlight =require("./routes/courseBatchHightlightRoute")
const coursedetailsroute =require("./routes/courseDetailsRoute")
const bookingroute =require("./routes/bookingRoute")
const notificationroute =require("./routes/notificationRoute")
const addressroute =require("./routes/addressRoute")
const exam_courseroute =require("./routes/exam_courseRoute")
const examQuesroute =require("./routes/exam_questionRoute")
const examAnswerroute =require("./routes/exam_answerRoute")
// const quizresultroute =require("./routes/quizResultRoute")
const exambookingroute =require("./routes/examBookingRoute")
const getintouchroute =require("./routes/getInTouchRoute")
const entranceroute =require("./routes/entranceRoute")
const dasboardroute =require("./routes/dasboardRoute")
const paymentroute =require("./routes/paymentRoute")
const examResult =require("./routes/examResultRoute")
const adminroute =require("./routes/adminRoute")
// const fingerprint = require("./routes/fingerprintRoute")
const previousYear = require("./routes/previousYearRoute")
const previousYearQuestion = require("./routes/previousYearQuestionRoute")
const studentInquiry = require("./routes/studentInquiryRoute")






const env = require('dotenv');
const cors = require('cors');
const ejs = require("ejs");


const mongoose= require("mongoose")
const app= express();

env.config();

const {initPayment, responsePayment} = require("./paytm/services/index");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");

app.post("/paywithpaytm", (req, res) => {
    const amount = req.body.amount;
    initPayment(amount).then(
        success => {
            res.render("paytmRedirect.ejs", {
                resultData: success,
                paytmFinalUrl: process.env.PAYTM_FINAL_URL
            });
        },
        error => {
            res.send(error);
        }
    );
});

app.post("/paywithpaytmresponse", (req, res) => {
    responsePayment(req.body).then(
        success => {
            res.render("response.ejs", {resultData: "true", responseData: success});
        },
        error => {
            res.send(error);
        }
    );
});


// app.use( multer().any())
mongoose.set({"strictQuery":true})
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.izbjwtv.mongodb.net/${process.env.MONGO_DB_DATABASE}`, {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

// app.use(cors());
app.options('*', cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use('/api', userroute);
app.use('/api', courseroute);
// app.use('/api', chapterroute);
app.use('/api', chapterroutev2);
app.use('/api', coursesubjectroute);
app.use('/api', notesubjectroute);
app.use('/api', mocksubjectroute);
app.use('/api', mockcourseroute);





// app.use('/api', notesroute);
app.use('/api', notesroutev2);

// app.use('/api',quizroute);
// app.use('/api',quizroute);

// app.use('/api',quizQuesroute);
// app.use('/api',quizAnsroute);
// app.use('/api', videoroute);
app.use("/api",mankavitroute)
app.use("/api",newsletterroute)
app.use("/api",examroute)
app.use("/api",achiversroute)
app.use("/api",testinomialroute)
app.use("/api",faqroute)
app.use("/api",facultyroute)
app.use("/api",facultydegreeroute)
app.use("/api",coursebatchroute)
app.use("/api",coursebatchhightlight)
app.use("/api",coursedetailsroute)
app.use("/api",bookingroute)
app.use("/api",notificationroute)
app.use("/api",addressroute)
app.use("/api",exam_courseroute)
app.use("/api",examQuesroute)
app.use("/api",examAnswerroute)
// app.use("/api",quizresultroute)
app.use("/api",exambookingroute)
app.use("/api",getintouchroute)
app.use("/api",entranceroute)
app.use("/api",dasboardroute)
app.use("/api",paymentroute)
app.use("/api",examResult)
app.use("/api",adminroute)
// app.use("/api",fingerprint)
app.use("/api",previousYear)
app.use("/api",previousYearQuestion)
app.use("/api",studentInquiry)






app.listen(process.env.PORT || 2000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 2000))
});
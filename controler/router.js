const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


const { v4: uuidv4 } = require('uuid');
// addmovie
const addmovieschema = require('../model/addmovieSchema');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const router = express.Router();


//****************************session cookies */

router.use(cookieParser());
router.use(
    session({
        key: "user_sid",
        secret: "somerandonstuffs",
        resave: false,
        saveUninitialized: false,
        cookie: {
            express: 10000,
        },
    })
);





//home api*************************************
// router.get('/', (req, res) => {
//     res.render('index');
// })




// added product
router.get('/', async (req, res) => {
    try {
        const movie = await addmovieschema.find({});

        res.render('index', { moviesdata: movie });
    } catch (error) {
        console.log(error);
    }
});







//about api
router.get('/about', (req, res) => {
    res.render('about');
})

//contact api 
router.get('/contact', (req, res) => {
    res.render('contact');
})



//login api*********************************************************

router.get("/login", (req, res) => {
    res.render("login", {
        error: null,
        message: null,
        showForgetPassword: true
    });
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;


    try {
        const user = await regsterationschema.findOne({ email }).exec();

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render("login", { error: "Invalid email or password", showForgetPassword: true });
        }
        req.session.user = { id: user._id, username: user.username, email: user.email };
        res.redirect('/dashboard');

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// FORGOT PASSWORD - Send Reset Link

router.get("/forgetPassword", (req, res) => {
    res.render("forgetPassword", { error: null, message: null });
});

router.post("/forgetPassword", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await regsterationschema.findOne({ email }).exec();

        if (!user) {
            return res.render("forgetPassword", { error: "Email not found", message: null });
        }

        //  Correct Field Names
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 3600000; // 1 hour expiry
        await user.save(); //  Ensure token is saved

        console.log("Reset Token Generated:", resetToken);

        // Send Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "negiprashant857@gmail.com",
                pass: "krwx klmn cxhf wlqu"
            }
        });

        const resetLink = `http://localhost:3007/resetPassword/${resetToken}`;
        const mailOptions = {
            to: user.email,
            from: "negiprashant857@gmail.com",
            subject: "Password Reset Request",
            html: `<p>Hello ${user.username},</p>
                <p>You requested to reset your password. Click the link below:</p>
                <a href="${resetLink}" style="background: green; color: white; padding: 10px; text-decoration: none;">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>`
        };

        await transporter.sendMail(mailOptions);
        res.render("forgetPassword", { error: null, message: "Reset link sent to your email!" });

    } catch (error) {
        console.error("Forget Password Error:", error);
        res.render("forgetPassword", { error: "Something went wrong", message: null });
    }
});


// GET - Reset Password Page
router.get("/resetPassword/:token", async (req, res) => {
    try {
        const token = req.params.token;
        console.log("Received Token:", token);

        const user = await regsterationschema.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() } //  Token should not be expired
        });

        console.log("User Found:", user);

        if (!user) {
            return res.render("resetPassword", { error: "Invalid or expired token", message: null, token: null });
        }

        res.render("resetPassword", { error: null, message: null, token: token });

    } catch (error) {
        console.log("Reset Password Error:", error);
        res.render("resetPassword", { error: "Something went wrong", message: null, token: null });
    }
});



// POST - Reset Password
router.post("/resetPassword/:token", async (req, res) => {
    try {
        const user = await regsterationschema.findOne({
            resetToken: req.params.token,
            resetTokenExpire: { $gt: Date.now() }

        });

        console.log("User Found for Reset:", user); // Debugging

        if (!user) {
            return res.render("resetPassword", { error: "Invalid or expired token", message: null, token: null });
        }

        //  Hash New Password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;

        //  Clear Token & Expiry
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        console.log("Password Updated Successfully");

        res.render("login", { message: "Password reset successful! Please login.", showForgetPassword: true });

    } catch (error) {
        console.log("Password Reset Error:", error);
        res.render("resetPassword", { error: "Something went wrong", message: null, token: null });
    }
});









//privacyPolicy api
router.get('/privacypolicy', (req, res) => {
    res.render('privacypolicy');
});

//Details api**********************************************************

// router.get('/details', (req, res) => {
//     res.render('details');
// });

router.get('/details/:id', async (req, res) => {
    try {
      const dmovie = await addmovieschema.findById(req.params.id);
      const movieId = req.params.id; 
  
      res.render('details', { dmoviesdata: dmovie, movie_id: movieId }); 
    } catch (error) {
      console.log(error);
    }
  });


//PRICE  api******************************** 
router.get('/pricing', (req, res) => {
    res.render('pricing');
});


//dashboard api*************************
router.get('/dashboard', function (req, res) {

    if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard/index');
    }
    else {
        res.redirect('/login');
    }
});













// ********************************* regstration api *********************************//


const regsterationschema = require('../model/regschema');

router.get('/register', (req, res) => {
    res.render('register');
});


router.post('/register', (req, res) => {

    const regsterdata = {
        username: req.body.username,
        contact: req.body.contact,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password
    };

    const regpost = new regsterationschema(regsterdata);
    regpost.save()
        .then(() => {
            res.json({ massage: 'regster seccussfully' })
        })

        .catch((error) => {
            res.json({ error: 'error: ' + error.massage });
        });
});


// **************view registration


router.get('/viewregstration', async (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        try {
            const reg = await regsterationschema.find({});
            res.render('dashboard/viewregstration', { regdata: reg });

        } catch (error) {
            console.log(error);
        }
    }
    else {
        res.redirect('/login');
    }
});



// delete  api ********************

router.get('/delete/:id', async (req, res) => {
    try {
        const regsterdata = await regsterationschema.findByIdAndDelete(req.params.id);
        res.redirect('/viewregstration');
    }
    catch (error) {
        console.log(error);
    }
})


// edit api****************************************************
router.get('/edit/:id', async (req, res) => {
    try {
        const regsterdata = await regsterationschema.findById(req.params.id);
        res.render('dashboard/edit-register', { regsterdata: regsterdata });
    }
    catch (error) {
        console.log(error);
    }
})



//update api*****************************************************
router.post('/edit/:id', async (req, res) => {

    const updateregsterdata = {
        username: req.body.username,
        contact: req.body.contact,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password
    };
    try {
        const updateregpost = await regsterationschema.findByIdAndUpdate(req.params.id,
            updateregsterdata);
        if (!updateregpost) {
            return res.status(404).json({ massage: 'item not found' });
        }
        res.redirect('/viewregstration')

    }
    catch (err) {
        return res.status(500).json({ massage: 'item not update' });
    }
});





// add movie api *******************************************
router.get('/addmovie', (req, res) => {

    if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard/addmovie');
    }


    else {
        res.redirect('/login');
    }
});






//file uplod api***********


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const filefilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/avif']
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, true);
    }

}

let upload = multer({ storage, filefilter });

//data post*********************

router.post('/postmovie', upload.single('cover'), (req, res) => {
    const addmovidata = {
        moviename: req.body.moviename,
        date: req.body.date,
        description: req.body.description,
        director: req.body.director,
        age: req.body.age,
        cover: req.file.filename,
        choose_genere: req.body.choose_genere,
        duration: req.body.duration,
        quality: req.body.quality,
        country: req.body.country,
        rating: req.body.rating,
        cast: req.body.cast
    };

    const addmoviepost = new addmovieschema(addmovidata);
    addmoviepost.save()
        .then(() => {
            res.json({ message: 'added successfully' });
        })
        .catch((error) => {
            // Correctly log and send the error message
            res.json({ message: 'err: ' + error.message });
        });
});


// view data***************
router.get('/viewmovies', async (req, res) => {

    if (req.session.user && req.cookies.user_sid) {
        try {
            const movie = await addmovieschema.find({});
            //console.log("Fetched Movies:", movie); 
            res.render('dashboard/viewmovies', { moviesdata: movie });
        } catch (error) {
            console.log(error);
        }
    }


    else {
        res.redirect('/login');
    }
});







// delete  api ********************

router.get('/delete2/:id', async (req, res) => {
    try {
        const addedmoviedata = await addmovieschema.findByIdAndDelete(req.params.id);
        res.redirect('/viewmovies');
    } catch (error) {
        console.log(error);
    }
});


// edit api****************************************************
router.get('/edit2/:id', async (req, res) => {
    try {
        const addedmoviedata = await addmovieschema.findById(req.params.id);
        res.render('dashboard/edit-movie', { addedmoviedata: addedmoviedata });
    }
    catch (error) {
        console.log(error);
    }
});
// update*******************************

router.post('/edit2/:id', async (req, res) => {

    const updatemovie = {
        moviename: req.body.moviename,
        date: req.body.date,
        description: req.body.description,
        director: req.body.director,
        age: req.body.age,
        cover: req.body.cover,
        choose_genere: req.body.choose_genere,
        duration: req.body.duration,
        quality: req.body.quality,
        country: req.body.country,
        rating: req.body.rating,
        cast: req.body.cast
    };
    try {
        const updatmoviepost = await addmovieschema.findByIdAndUpdate(req.params.id, updatemovie);
        if (!updatmoviepost) {
            return res.status(404).json({ massage: 'item not found' });
        }
        res.redirect('/viewmovies')

    }
    catch (err) {
        return res.status(500).json({ massage: 'item not update' });
    }
});









// ************************************Contact api**************************


const contactschema = require('../model/contschema');



router.get('/contact', (req, res) => {
    res.render('contact');
});


router.post('/contact', (req, res) => {
    const contactdata = {
        name: req.body.name,
        email: req.body.email,
        contact: req.body,
        subject: req.body.subject,
        massage: req.body.massage
    };

    const contactpost = new contactschema(contactdata);
    contactpost.save()

        .then(() => {
            res.json({ massage: 'submit successfully' })
        })
        .catch((error) => {
            res.status(400).json({ error: 'error' + error });
        });
});

//data get in dashboard**********************************
router.get('/viewcontact', async (req, res) => {

    if (req.session.user && req.cookies.user_sid) {
        try {
            const cont = await contactschema.find({});

            res.render('dashboard/viewcontact', { contdata: cont });
        }
        catch (error) {
            console.log(error);
        }
    }


    else {
        res.redirect('/login');
    }
});



// delete*********************
router.get('/delete3/:id', async (req, res) => {
    try {
        const contactdata = await contactschema.findByIdAndDelete(req.params.id);
        res.redirect('/viewcontact');
    }
    catch (error) {
        console.log(error);
    }
})

// edit api****************************************************
router.get('/edit3/:id', async (req, res) => {
    try {
        const contactdata = await contactschema.findById(req.params.id);
        res.render('dashboard/edit-contact', { contactdata: contactdata });
    }
    catch (error) {
        console.log(error);
    }
})

//update api*****************************************************
router.post('/edit3/:id', async (req, res) => {

    const updatecontactdata = {
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        subject: req.body.subject,
        massage: req.body.massage
    };
    try {
        const upgadecontpost = await contactschema.findByIdAndUpdate(req.params.id,
            updatecontactdata);
        if (!upgadecontpost) {
            return res.status(404).json({ massage: 'item not found' });
        }
        res.redirect('/viewcontact')

    }
    catch (err) {
        return res.status(500).json({ massage: 'item not update' });
    }
});




// ************************************Contact api**************************



// search api*********************************

router.get('/search', async (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery) {
        return res.json([]);
    }

    try {
        // Search for movies whose 'moviename' matches the search query
        const results = await addmovieschema.find({
            moviename: { $regex: searchQuery, $options: 'i' }  // 'i' makes it case-insensitive
        });

        res.json(results);  // Return matching results
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





// commetn  post*******************s

router.post('/movies/:movieId/comments', async (req, res) => {
    try {
      // ... (your code)
      const newComment = new Comment({
        movieId: movieId,
        guestName: guestName,
        comment: comment
      });
      // ... (your code)
    } catch (error) {
      // ... (your code)
    }
  });

// //   get comment API
// router.get('/movies/:movieId/comments', async (req, res) => {
//     try {
//       const movieId = req.params.movieId;
//       const comments = await Comment.find({ movieId: movieId });
//       res.json(comments);
//     } catch (error) {
//       console.error(error);
//       res.json({ message: 'err: ' + error.message });
//     }
//   });



module.exports = router; 
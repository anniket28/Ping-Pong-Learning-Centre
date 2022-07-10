// Require
const { urlencoded } = require('express')
const express=require('express')
const path=require('path')
const nodemailer=require('nodemailer')
const session=require('express-session')
const flash=require('connect-flash')
const fs=require('fs')

// Port
const port=process.env.PORT || 2000 

// App
const app=express()

// Use
app.use('/static',express.static('static'))
app.use(urlencoded({extended:false}))
app.use(session({
    secret:'drPDh5s2CJzzfK7PWDWxbonzVoPf5OvY',
    resave:true,
    saveUninitialized:true
}))
app.use(flash())

// Set
app.set('view-engine','ejs')
app.set('views',path.join(__dirname,'views'))

// Current Year
let dt=new Date()
let currentYear=dt.getFullYear()

// Redirecting
app.get('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
      res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
    } else {
      next();     
    }
})

// Home Page
app.get('/',(req,res)=>{
    res.status(200).render('index.ejs',{title:'',currentYear:currentYear,visit_booked:req.flash('visit_booked')})
})

// About Page
app.get('/about',(req,res)=>{
    res.status(200).render('about.ejs',{title:'About | ',currentYear:currentYear,visit_booked:req.flash('visit_booked')})
})

// Our Programs Page
app.get('/our-programs',(req,res)=>{
    res.status(200).render('ourprograms.ejs',{title:'Our Programs | ',currentYear:currentYear,visit_booked:req.flash('visit_booked')})
})

// Admission Page
app.get('/admission',(req,res)=>{
    res.status(200).render('admission.ejs',{title:'Admission | ',currentYear:currentYear,visit_booked:req.flash('visit_booked'),admission_enquiry_sent:req.flash('admission_enquiry_sent')})
})

// Our Gallery Page
app.get('/our-gallery',(req,res)=>{
    let galleryImages=fs.readdirSync('static/images/Gallery')
    res.status(200).render('gallery.ejs',{title:'Our Gallery | ',currentYear:currentYear,galleryImages:galleryImages, visit_booked:req.flash('visit_booked')})
})

// Contact Us Page
app.get('/contact-us',(req,res)=>{
    res.status(200).render('contactus.ejs',{title:'Contact Us | ',currentYear:currentYear,visit_booked:req.flash('visit_booked'),message_sent:req.flash('message_sent')})
})

// Faq Page
app.get('/faq',(req,res)=>{
    res.status(200).render('faq.ejs',{title:'FAQ | ',currentYear:currentYear,visit_booked:req.flash('visit_booked')})
})

// Privacy Policy Page
app.get('/privacy-policy',(req,res)=>{
    res.status(200).render('privacypolicy.ejs',{title:'Privacy Policy | ',currentYear:currentYear,visit_booked:req.flash('visit_booked')})
})

// Admission Enquiry - Post Request
app.post('/admission-enquiry',(req,res)=>{
    try {
        // Getting Value From Body
        const {childName, childDateOfBirth, parentName, parentOccupation, parentContactNumber, email, address}=req.body

        // Converting Date of Birth
        let stringDate=new Date(childDateOfBirth)
        let theDate=stringDate.getDate()
        let theMonth=stringDate.getMonth()
        let theYear=stringDate.getFullYear()

        let theDateOfBirth=theDate + "-" +(theMonth + 1) + "-" + theYear;

        // Transporter
        var transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'newmailer715@gmail.com',
                pass:'xvivyybvtxcnsvkr'
            }
        })
        // Mail Options
        var mailOptions={
            from:'newmailer715@gmail.com',
            to:'pingponghwr@gmail.com',
            subject:'New Message Received',
            text:`A new admission enquiry has been received for Ping Pong Learning Centre. \nDetails:\nChild Name : ${childName}\nChild Date of Birth : ${theDateOfBirth}\nParent Name : ${parentName}\nParent Occupation : ${parentOccupation}\nParent Contact Number : ${parentContactNumber}\nEmail : ${email}\nAddress : ${address} `
        }
        // Send Mail
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log('Email Sent : '+info.response)
            }
        })

        req.flash('admission_enquiry_sent','Thank You for enquiring about admission.\nWe will contact you and guide you with the next steps.')
        res.redirect('/admission')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Send Message - Post Request
app.post('/send-message',(req,res)=>{
    try {
        // Getting Value From Body
        const {name, contactNumber, email, subject, message}=req.body

        // Transporter
        var transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'newmailer715@gmail.com',
                pass:'xvivyybvtxcnsvkr'
            }
        })
        // Mail Options
        var mailOptions={
            from:'newmailer715@gmail.com',
            to:'pingponghwr@gmail.com',
            subject:'New Message Received',
            text:`A new message has been received from Ping Pong Contact Us. \nDetails:\nName : ${name}\nContact Number : ${contactNumber}\nEmail : ${email}\nSubject : ${subject}\nMessage : ${message} `
        }
        // Send Mail
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log('Email Sent : '+info.response)
            }
        })

        req.flash('message_sent','Thank You for sending us a message. We will get back to you soon.')
        res.redirect('/contact-us')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Book A Visit - Post Request
app.post('/book-a-visit',(req,res)=>{
    try {
        // Getting Value From Body
        const {parentName, childName, contactNumber, email, date, timeSlot, myUrl}=req.body

        // Getting My Url Value
        let theUrl=myUrl.split('/')
        let redirectUrl=theUrl[3]

        // Converting Date
        let stringDate=new Date(date)
        let theDate=stringDate.getDate()
        let theMonth=stringDate.getMonth()
        let theYear=stringDate.getFullYear()

        let convertedDate=theDate + "-" +(theMonth + 1) + "-" + theYear;

        // Simplifying Time Slot
        let theTimeSlot=timeSlot.split("-")
        let simplifiedTimeSlot=theTimeSlot[0]+" - "+theTimeSlot[1]

        // Transporter For Self
        var transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'newmailer715@gmail.com',
                pass:'xvivyybvtxcnsvkr'
            }
        })
        // Mail Options For Self
        var mailOptions={
            from:'newmailer715@gmail.com',
            to:'pingponghwr@gmail.com',
            subject:'New Visit Booked',
            text:`A new visit has been book for Ping Pong Larning Centre. \nDetails:\nParent Name : ${parentName}\nChild Name : ${childName}\nContact Number : ${contactNumber}\nEmail : ${email}\nDate : ${convertedDate}\nTime Slot : ${simplifiedTimeSlot} `
        }
        // Send Mail For Self
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log('Email Sent : '+info.response)
            }
        })

        // Transporter For User
        var transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'pingponglearningcentre@gmail.com',
                pass:'ntwuuyhcdhxznnho'
            }
        })
        // Mail Options For User
        var mailOptions={
            from:'pingponglearningcentre@gmail.com',
            to:email,
            subject:'Visit Booked Successfully',
            text:`Your visit for Ping Pong Learning Centre has been booked successfully. Please check out the details below:\nDetails:\nParent Name : ${parentName}\nChild Name : ${childName}\nContact Number : ${contactNumber}\nEmail : ${email}\nDate : ${convertedDate}\nTime Slot : ${simplifiedTimeSlot} `
        }
        // Send Mail For User
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log('Email Sent : '+info.response)
            }
        })

        req.flash('visit_booked','Your visit has been booked successfully.')
        res.redirect(`/${redirectUrl}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// App Run
app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})
const express = require("express");
const app = express();
const path = require("path");
const Chat = require("./models/chat.js")
const mongoose = require("mongoose");
const methodeOverride = require("method-override");



app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodeOverride("_method"));

main()
.then(res => console.log("connection sucessfull"))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/instagram");
}

// view page 
app.get("/chats", async(req,res)=>{
    let chats = await Chat.find();
    res.render("index.ejs", {chats});
} )

app.get("/chats/new", (req,res)=> {
    res.render("new.ejs");
})

app.post("/chats", (req,res)=> {
    let {from, to, message } = req.body
    let newChat = new Chat({
        from : from ,
        to : to,
        message : message,
        createAt : new Date()
    });
    console.log(newChat);
    newChat
    .save()
    .then((res)=> console.log(res))
    .catch((err)=> console.log(err))
    res.redirect("/chats");

})




app.get("/", (req,res)=> {
    res.send("root is working");
})

app.listen(3000, ()=> {
    console.log("server is listening to the port");
})

app.get("/chats/:id/edit",async(req,res)=> {
    let {id} = req.params;
    let chat = await Chat.findById(id);

    res.render("edit.ejs", {chat});
})

app.put("/chats/:id",async(req,res)=> {
    let {id}  = req.params;
    let {message : newMessage} = req.body;
    console.log(newMessage);
    let updateChat = await Chat.findByIdAndUpdate(id, {message: newMessage},{runValidators:true, new : true}); 
    console.log(updateChat);
    res.redirect("/chats"); 
})

app.delete("/chats/:id", async(req,res) => {
    let {id} = req.params;
    let delteChat = await Chat.findByIdAndDelete(id);
    console.log(delteChat);
    res.redirect("/chats");
})
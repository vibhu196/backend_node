const Todo = require("../Models/todoModel");


  exports.createTodo= async(req , res) =>{
    try {
        const myTodo = new Todo(req.body);
        await myTodo.save()
        res.status(200).json(myTodo)
    } catch (error) {
        res.status(400).json({error:err.message })
    }
  }
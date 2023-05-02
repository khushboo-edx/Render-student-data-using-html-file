const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

const port = 8000;
let students = [];

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.post('/', (req, res) => {
  const { name, id, department, gender, subject1, subject2, subject3 } = req.body;
  const totalMarks = parseInt(subject1) + parseInt(subject2) + parseInt(subject3);
  const percentage = (totalMarks / 300) * 100;
  const status = percentage >= 40 ? 'Pass' : 'Fail';
  const student = { name, id, department, gender, subject1, subject2, subject3, totalMarks, percentage, status };
  students.push(student);
  fs.writeFile('./index1.html',JSON.stringify(students), err =>{
    if(err){
        console.log(err)
    }else{
        console.log("File created successfully")
    }
  })
  res.status(200).json({message : "Data created Successfully"});
});
app.get('/', (req, res) => {
    fs.readFile('/index1.html',err=>{
        if(err){
            console.log(err)
        }else{
            console.log("Get data successfully")
        }
    })
 res.sendFile(__dirname + '/index1.html')
});
  

app.put('/:id', (req, res) => {
  let id = req.params.id;
  let newData = req.body;
  let index = students.findIndex(obj => obj.id == id);
  if(index !== -1) {
      students[index] = { ...students[index], ...newData };
      res.status(200).json(students[index]);
  } else {
      res.status(404).json({ message: "Object not found" });
  }
});

app.delete('/:id', (req, res) => {
  let id = req.params.id;
  let index = students.findIndex(obj => obj.id == id);
  if(index !== -1) {
      students.splice(index, 1);
      res.status(200).json({ message: "Object deleted successfully" });
  } else {
      res.status(404).json({ message: "Object not found" });
  }
});

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});

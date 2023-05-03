const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

const port = 8000;
let students = [];

app.use(express.json());
app.use(express.static(__dirname + '/public'));

fs.readFile('./student.json', (err, data) => {
  if (err) {
    console.log(err);
  }
});

app.post('/', (req, res) => {
  const { name, id, department, gender, subject1, subject2, subject3 } = req.body;
  const totalMarks = parseInt(subject1) + parseInt(subject2) + parseInt(subject3);
  const percentage = (totalMarks / 300) * 100;
  const status = percentage >= 40 ? 'Pass' : 'Fail';
  const student = { name, id, department, gender, subject1, subject2, subject3, totalMarks, percentage, status };

  students.push(student);
  fs.writeFile('./student.json', JSON.stringify(students), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Data added successfully');
      res.status(200).json({ message: 'Data created successfully' });
    }
  });
});

app.get('/', (req, res) => {
    fs.readFile('./student.json', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        students = JSON.parse(data);
        let html = '';
        students.forEach((student) => {
          html += `<tr><td>${student.name}</td><td>${student.id}</td><td>${student.department}</td><td>${student.gender}</td><td>${student.subject1}</td><td>${student.subject2}</td><td>${student.subject3}</td><td>${student.totalMarks}</td><td>${student.percentage}</td><td>${student.status}</td></tr>`;
        });
        let indexHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Students List</title>
              <link rel="stylesheet" href="style.css">
            </head>
            <body>
              <h1>Students List</h1>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Department</th>
                    <th>Gender</th>
                    <th>Subject 1</th>
                    <th>Subject 2</th>
                    <th>Subject 3</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>${html}</tbody>
              </table>
            </body>
          </html>
        `;
        res.send(indexHtml);
      }
    });
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
  
import express from 'express';

export const app = express();
const port = 3000;

const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}

export const db = {
  courses: [
    {id: 1, title: "front-end"},
    {id: 2, title: "back-end"},
    {id: 3, title: "Automation qa"},
    {id: 4, title: "devops"}
  ]
};

app.get('/', (req, res) => {
  res.send('<h1>IT-KAMASUTRA!!!</h1>');
});

app.get('/courses', (req, res) => {
  let filterCourse = db.courses;
  if (req.query.title)
    filterCourse = filterCourse.filter(c => c.title.indexOf(req.query.title as string) > -1);
  res.json(filterCourse);
});

app.get('/courses/:id', (req, res) => {
  const filterCourse = db.courses.find(c => c.id === +req.params.id);

  if (!filterCourse) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
  res.json(filterCourse);
});

app.post('/courses', (req, res) => {


  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const course = {id: (db.courses.length + 1), title: req.body.title};
  db.courses.push(course);
  res.status(HTTP_STATUSES.CREATED_201).json(course);
});

app.delete('/courses/:id', (req, res) => {
  db.courses = db.courses.filter(c => c.id !== +req.params.id);

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

app.put('/courses/:id', (req, res) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const filterCourse = db.courses.find(c => c.id === +req.params.id);

  if (!filterCourse) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }

  filterCourse.title = req.body.title;
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.delete('/__test__/data', (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
})
import request from "supertest";
import {app, db, HTTP_STATUSES} from '../../src'

describe('/course', () => {
  beforeAll(async () => {
    await request(app)
      .delete('/__test__/data')
  })

  it('should return 200 and empty array', async () => {
    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, []);
  });

  it('should return 404 for not existing course', async () => {
    await request(app)
      .get('/courses/6')
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('should not create course with incorrect input data', async () => {
    await request(app)
      .post('/courses')
      .send({title: ""})
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, []);
  });

  let createdCourse1: any = null;
  it('should create course with  input data', async () => {
    const createResponse = await request(app)
      .post('/courses')
      .send({title: "new good course"})
      .expect(HTTP_STATUSES.CREATED_201, {
        id: 1,
        title: "new good course"
      });

    createdCourse1 = createResponse.body;

    expect(createdCourse1).toEqual({id: expect.any(Number), title: "new good course"})

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [createdCourse1]);
  });

  let createdCourse2: any = null;
  it('should create one more', async () => {
    const createResponse = await request(app)
      .post('/courses')
      .send({title: "new good course 2"})
      .expect(HTTP_STATUSES.CREATED_201, {
        id: 2,
        title: "new good course 2"
      });

    createdCourse2 = createResponse.body;

    expect(createdCourse2).toEqual({id: expect.any(Number), title: "new good course 2"})

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2]);
  });

  it('should not update course with incorrect input data', async () => {
    await request(app)
      .put(`/courses/${createdCourse1.id}`)
      .send({title: ""})
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.OK_200, createdCourse1);
  });

  it('should not update course that not exist', async () => {
    await request(app)
      .put(`/courses/0`)
      .send({title: "new course 2"})
      .expect(HTTP_STATUSES.NOT_FOUND_404);

  });

  it('should  update course  with correct input data', async () => {
    await request(app)
      .put(`/courses/${createdCourse1.id}`)
      .send({title: "new course 3"})
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.OK_200, {...createdCourse1, title: "new course 3"});

    await request(app)
      .get(`/courses/${createdCourse2.id}`)
      .expect(HTTP_STATUSES.OK_200, createdCourse2);
  });

  it('should delete both course', async () => {
    await request(app)
      .delete(`/courses/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app)
      .get(`/courses`)
      .expect(HTTP_STATUSES.OK_200,[createdCourse2]);

    await request(app)
      .delete(`/courses/${createdCourse2.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/courses/`)
      .expect(HTTP_STATUSES.OK_200,[]);
  });

});
import { test } from '@playwright/test';
import { Validation } from '../../utils/validation';

//ตัวอย่างกรณีต้องการทดสอบเส้น API แบบไม่ระบุข้อมูลโดย Code จะทำการสุ่มค่า ID , และ UserID ที่ต้องใช้ในการ Request
test.describe('API testing dynamic', () => {
  let randomPostId;
  let randomUserId;
  let uniqueUserId;
  let listPostId: any[] = [];
  let listUserId: any[] = [];
  const validation = new Validation();
  const expectJson = ['id', 'userId', 'title', 'body'];

  test.beforeEach(async ({ request }) => {
    //ก่อนเริ่ม Test ทุกครั้งจะทำการดึงข้อมูลทั้งหมดก่อน
    const response = await request.get(`/posts`);
    const responseBody = await response.json();

    //เก็บค่า id และ userid ที่ได้จากการดึงข้อมูล ไปเก็บไว้ใน array
    await responseBody.forEach((element) => {
      listUserId.push(element.userId);
      listPostId.push(element.id);
    });

    //ตัดค่า user id ที่ได้ซ้ำกันออก
    uniqueUserId = [...new Set(listUserId)];

    //สุ่ม id และ user id ใหม่ โดยเอาข้อมูลเลขจำนวนที่สูงที่สุดใน array มาคูณกับเลขทศนิยม
    randomPostId = await Math.floor(Math.random() * Math.max(...listPostId));
    randomUserId = await Math.floor(Math.random() * Math.max(...uniqueUserId));
  });

  test('Get post by existing id', async ({ request }) => {
    const response = await request.get(`/posts/${randomPostId}`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });
  test('Get post by not existing id', async ({ request }) => {
    const response = await request.get(`/posts/${listPostId.pop() + 1}`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Get post list', async ({ request }) => {
    const response = await request.get(`/posts`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Get post list and filter by user id', async ({ request }) => {
    const response = await request.get(`/posts?userId=${randomUserId}`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Create post', async ({ request }) => {
    const response = await request.post(`/posts?userId=${randomUserId}`, {
      data: { title: 'Testing', body: 'testing', userId: randomUserId },
    });
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Update post title and post body by existing id', async ({
    request,
  }) => {
    const response = await request.put(`/posts/${randomPostId}`, {
      data: {
        id: randomPostId,
        title: 'Testing',
        body: 'testing',
        userId: randomUserId,
      },
    });
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Update post title by existing id', async ({ request }) => {
    const response = await request.patch(`/posts/${randomPostId}`, {
      data: { title: 'Testing' },
    });
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Delete post', async ({ request }) => {
    const response = await request.delete(`/posts/${randomPostId}`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });
});

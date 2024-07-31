import { test } from '@playwright/test';
import { Validation } from '../../utils/validation';

//ตัวอย่างกรณีต้องการทดสอบเส้น API แบบระบุข้อมูลเองผ่านตัวแปร
test.describe('API testing static', () => {
  const postId = 1;
  const userId = 1;
  const postIdNotExisting = 101;
  const validation = new Validation();
  const expectJson = ['id', 'userId', 'title', 'body'];

  test('Get post by existing id', async ({ request }) => {
    const response = await request.get(`/posts/${postId}`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Get post by not existing id', async ({ request }) => {
    const response = await request.get(`/posts/${postIdNotExisting}`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(
      responseBody,
      expectJson,
      'not existing id'
    );
  });

  test('Get post list', async ({ request }) => {
    const response = await request.get(`/posts`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Get post list and filter by user id', async ({ request }) => {
    const response = await request.get(`/posts?userId=${userId}`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Create post', async ({ request }) => {
    const response = await request.post(`/posts?userId=${userId}`, {
      data: { title: 'Testing', body: 'testing', userId: userId },
    });
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Update post title and post body by existing id', async ({
    request,
  }) => {
    const response = await request.put(`/posts/${postId}`, {
      data: { id: postId, title: 'Testing', body: 'testing', userId: userId },
    });
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Update post title by existing id', async ({ request }) => {
    const response = await request.patch(`/posts/${postId}`, {
      data: { title: 'Testing' },
    });
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson);
  });

  test('Delete post', async ({ request }) => {
    const response = await request.delete(`/posts/1`);
    const responseBody = await response.json();
    await validation.checkKeyOfJson(responseBody, expectJson, 'Delete post');
  });
});

import { expect } from '@playwright/test';

export class Validation {
    //สำหรับตรวจสอบ Key ใน json ตอน Response ว่าออกถูกต้องตาม Expect ที่ต้องการหรือไม่
  checkKeyOfJson(responseBody: any, arr: any, message?: string) {
    if (Array.isArray(responseBody)) {
      arr.forEach((val, index) => {
        expect(responseBody[index]).toHaveProperty(val);
      });
    } else if (Object.keys(responseBody).length !== 0) {
      arr.forEach((val) => {
        expect(responseBody).toHaveProperty(val);
      });
    } else {
      console.log(`No key of json becase case ${message}`);
    }
  }
}

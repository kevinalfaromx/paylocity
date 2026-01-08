// @ts-check
import { test, expect } from '@playwright/test';
import { generateRandomName } from '../helpers/randomString';

const url = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees';
const auth = `Basic VGVzdFVzZXI4NjQ6fXorbjJkVmF5L1Jz`;
const accept = 'application/json';

test('Verify 200 - GET Employees', async ({ request }) => {

  const response = await request.get(url, {
    headers: {
      'Authorization': auth,
      'Accept': accept
    },
  });

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).not.toBeNull();
});

test('Verify 200 - POST & GET Employees ', async ({ request }) => {
  const randomFirstname = generateRandomName(7);
  const randomLastname = generateRandomName(9);
  const randomDependent = Math.floor(Math.random() * 33);

  const body = {
    firstName: randomFirstname,
    lastName: randomLastname,
    dependents: randomDependent
  }
  const response = await request.post(url, {
    headers: {
      'Authorization': auth,
      'Accept': accept
    },
    data: body,
  });

  expect(response.status()).toBe(200);
  const paylocityResponseData = await response.json();
  
  const employeeId = paylocityResponseData['id'];

  const employeeInfo = await request.get(url + '/' + employeeId, {
    headers: {
      'Authorization': auth,
      'Accept': accept
    },
  });
  expect(employeeInfo.status()).toBe(200);
  const employeeRecord = await employeeInfo.json();
  console.log(employeeRecord);
  console.log(employeeRecord['dependants']);
  console.log(randomDependent);
  expect(randomFirstname).toEqual(employeeRecord['firstName']);
  expect(randomLastname).toEqual(employeeRecord['lastName']);
  expect(randomDependent).toEqual(employeeRecord['dependants']);

});

test('Verify 200 - GET Employee Record', async ({ request }) => {

  const response = await request.get(url + '/0b1a09ff-4857-4cb6-9886-9dc7ba7c9770', {
    headers: {
      'Authorization': auth,
      'Accept': accept
    },
  });

  expect(response.status()).toBe(200);
  const data = await response.json();
  console.log(data);
});

test('Verify 200 - POST & PUT Employees ', async ({ request }) => {
  const randomFirstname = generateRandomName(7);
  const randomLastname = generateRandomName(9);
  const randomDependent = Math.floor(Math.random() * 33);

  const body = {
    firstName: randomFirstname,
    lastName: randomLastname,
    dependents: randomDependent
  }

  const response = await request.post(url, {
    headers: {
      'Authorization': auth,
      'Accept': accept
    },
    data: body,
  });

  expect(response.status()).toBe(200);

  const paylocityResponseData = await response.json();  
  const employeeId = paylocityResponseData['id'];
  const randomFirstnameNew = generateRandomName(7);
  const randomLastnameNew = generateRandomName(9);
  const randomDependentNew = Math.floor(Math.random() * 33);

  const bodyNew = {
    firstName: randomFirstnameNew,
    lastName: randomLastnameNew,
    dependents: randomDependentNew,
    id: employeeId
  }

  const updateEmployeeInfo = await request.put(url, {
    headers: {
      'Authorization': auth,
      'Accept': accept
    },
    data: bodyNew,
  });

  expect(updateEmployeeInfo.status()).toBe(200);
  const updatedEmployeeRecord = await updateEmployeeInfo.json();
  console.log(updatedEmployeeRecord);
  console.log(updatedEmployeeRecord['dependants']);
  console.log(randomDependent);
  expect(randomFirstnameNew).toEqual(updatedEmployeeRecord['firstName']);
  expect(randomLastnameNew).toEqual(updatedEmployeeRecord['lastName']);
  expect(randomDependentNew).toEqual(updatedEmployeeRecord['dependants']);
});

test('Verify 400 - POST Employees FirstName', async ({ request }) => {
  const randomFirstname = '';
  const randomLastname = generateRandomName(7);
  const randomDependent = '';

  const body = {
    firstName: randomFirstname,
    lastName: randomLastname,
    dependents: randomDependent
  }
  const response = await request.post(url, {
    headers: {
      'Authorization': auth,
      'Accept': accept
    },
    data: body,
  });

  expect(response.status()).toBe(400);
  const errorMsg = await response.json();
  expect(errorMsg[0].errorMessage).toEqual('The FirstName field is required.');
 

});

test('Verify 400 - POST Employees LastName', async ({ request }) => {
  const randomFirstname = generateRandomName(7);
  const randomLastname = '';
  const randomDependent = '';

  const body = {
    firstName: randomFirstname,
    lastName: randomLastname,
    dependents: randomDependent
  }
  const response = await request.post(url, {
    headers: {
      'Authorization': auth,
      'Accept': accept
    },
    data: body,
  });

  expect(response.status()).toBe(400);
  const errorMsg = await response.json();
  expect(errorMsg[0].errorMessage).toEqual('The LastName field is required.');
});
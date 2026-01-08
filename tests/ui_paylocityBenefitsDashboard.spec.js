// @ts-check
import { test, expect } from '@playwright/test';
import { myPom } from '../page_model/pom';

test.beforeEach(async ({page, baseURL}) => {
  await page.goto('Prod/Account/Login');
});

test('Verify Paylocity Login', async ({ page }) => {
  const usePom = new myPom(page);
  await expect(usePom.paylocityLogo).toBeVisible();
  await expect(usePom.userLabel).toBeVisible();
  await expect(usePom.userField).toBeVisible();
  await expect(usePom.passLabel).toBeVisible();
  await expect(usePom.passField).toBeVisible();
  await expect(usePom.loginButton).toBeVisible();
});

test('Verify Paylocity User Login & Logout', async ({ page }) => {
  const usePom = new myPom(page);
  await usePom.loginUser();
  await expect(page.getByRole('link', { name: 'Paylocity Benefits Dashboard' })).toBeVisible();
  await usePom.logoutUser.click();
  await expect(usePom.paylocityLogo).toBeVisible();
});

test('Verify add employee form', async ({ page }) => {
  const usePom = new myPom(page);
  await usePom.loginUser();
  await usePom.clickOnAddEmployee();
  await usePom.verifyAddEmployeeForm();
});

test('Verify employer can add employee', async ({ page }) => {
  const usePom = new myPom(page);
  await usePom.loginUser();
  await usePom.clickOnAddEmployee();
  await usePom.fillEmployeeForm();
});

test('Verify employee record information', async ({ page }) => {
  const usePom = new myPom(page);
  await usePom.loginUser();
  const salary = '52000.00';
  const grossPay = 2000.00;
  const annualBenefitCost = 1000/26;
  const annualdependants = 500/26;
  let benefitCost = 0;
  let netPay = 0;

  const recordsTable = await page.locator('#employeesTable').locator('tr td').all();
  
  for(let i = 0; i< recordsTable.length; i++) {
    expect(await recordsTable[i].innerText()).not.toBeNull();
    expect(await recordsTable[i+1].innerText()).not.toBeNull();
    expect(await recordsTable[i+2].innerText()).not.toBeNull();
    expect(await recordsTable[i+3].innerText()).not.toBeNull();
    const numOfDependants = await recordsTable[i+3].innerText();
    expect(await recordsTable[i+4].innerText()).toEqual(salary);
    expect(await recordsTable[i+5].innerText()).toEqual(grossPay.toFixed(2));
    benefitCost = annualBenefitCost + ( annualdependants * Number(numOfDependants));
    expect(await recordsTable[i+6].innerText()).toEqual(benefitCost.toFixed(2));
    netPay = grossPay - benefitCost;
    expect(await recordsTable[i+7].innerText()).toEqual(netPay.toFixed(2));
    i = i + 8;
  }
});

test('Verify delete employee form', async ({ page }) => {
  const usePom = new myPom(page);
  await usePom.loginUser();
  await usePom.clickOnDeleteEmployee();
  await usePom.verifyDeleteEmployeeForm();
});

test('Verify employer can delete employee', async ({ page }) => {
  const usePom = new myPom(page);
  await usePom.loginUser();
  await usePom.clickOnDeleteEmployee();
  await usePom.confirmDeleteEmployee();
});

test('Verify employer can update employee', async ({ page }) => {
  const usePom = new myPom(page);
  await usePom.loginUser();
  await usePom.updateEmployee();
});

test('Verify headers employees table', async ({ page }) => {
  const usePom = new myPom(page);
  const headers = ['Id', 'Last Name', 'First Name', 'Dependents', 'Salary', 'Gross Pay', 'Benefits Cost', 'Net Pay', 'Actions']
  await usePom.loginUser();

  const recordsTable = await page.locator('#employeesTable').locator('tr th').all();
  
  for(let i = 0; i<recordsTable.length; i++) {
    expect(await recordsTable[i].innerText()).toEqual(headers[i]);
  }  
});

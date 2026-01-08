const { expect } = require('@playwright/test');
import { generateRandomName } from '../helpers/randomString';

exports.myPom = class myPom {

    constructor(page) {
    //Login Elements    
        this.page = page;
        this.paylocityLogo = page.getByRole('img', { name: 'Paylocity' });
        this.userLabel = page.getByText('Username');
        this.passLabel = page.getByText('Password');
        this.loginButton = page.getByRole('button', { name: 'Log In' });
        this.userField = page.getByRole('textbox', { name: 'Username' });
        this.passField = page.getByRole('textbox', { name: 'Password' });

    //Paylocity Benefits Dashboard Elements
        this.logoutUser = page.getByRole('link', { name: 'Log Out' });
        this.addEmployeeButton = page.getByRole('button', { name: 'Add Employee' });
        this.editEmployeeIcon = page.locator('i').first();
        this.deleteEmployeeIcon = page.locator('i').nth(1);
    
    //Paylocity Benefits Dashboard Add Employee Elements
        this.firstNameLabel = page.getByText('First Name:');
        this.firstNameField = page.getByRole('textbox', { name: 'First Name:' });
        this.lastNameLabel = page.getByText('Last Name:');
        this.lastNameField = page.getByRole('textbox', { name: 'Last Name:' });
        this.dependentsLabel = page.getByText('Dependents:');
        this.dependentsField = page.getByRole('textbox', { name: 'Dependents:' });
        this.cancelAddEmployeeButton = page.getByRole('button', { name: 'Cancel' });
        this.addEmployeeRecord = page.getByRole('button', { name: 'Add', exact: true });

    //Paylocity Benefits Dashboard Delete Employee Elements
        this.deleteHeader = page.getByRole('heading', { name: 'Delete Employee' });
        this.deleteText = page.getByText('Delete employee record for');
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.deleteCancelButton = page.getByRole('button', { name: 'Cancel' });

    //Paylocity Benefits Dashboard Update Employee Elements
        this.updateEmployeeButton = page.getByRole('button', { name: 'Update' });
    }

    async loginUser(){
        await expect(this.userField).toBeVisible();
        await expect(this.passField).toBeVisible();
        await this.userField.fill('TestUser864');
        await this.passField.fill('}z+n2dVay/Rs');
        const [responseEmployee] = await Promise.all([
            this.page.waitForResponse(responseEmployee => 
                responseEmployee.url().endsWith('/Prod/api/employees') && 
                responseEmployee.status() === 200 && 
                responseEmployee.request().method() === 'GET'),
            await this.loginButton.click()
        ]);
    }

    async clickOnAddEmployee(){
        await this.addEmployeeButton.scrollIntoViewIfNeeded();
        await expect(this.addEmployeeButton).toBeVisible();
        await this.addEmployeeButton.click();
    }
    
    async verifyAddEmployeeForm(){
        await expect(this.firstNameLabel).toBeVisible();
        await expect(this.firstNameField).toBeVisible();
        await expect(this.lastNameLabel).toBeVisible();
        await expect(this.lastNameField).toBeVisible();
        await expect(this.dependentsLabel).toBeVisible();
        await expect(this.dependentsField).toBeVisible();
        await expect(this.cancelAddEmployeeButton).toBeVisible();
        await expect(this.addEmployeeRecord).toBeVisible();
    }

    async fillEmployeeForm(){
        const randomFirstname = generateRandomName(6);
        const randomLastname = generateRandomName(7);
        const randomDependent = Math.floor(Math.random() * 33);
        await expect(this.firstNameField).toBeVisible();
        await this.firstNameField.fill(randomFirstname);
        await this.lastNameField.fill(randomLastname);
        await this.dependentsField.fill(randomDependent.toString());
        const [responseEmployee] = await Promise.all([
            this.page.waitForResponse(responseEmployee => 
                responseEmployee.url().endsWith('/Prod/api/employees') && 
                responseEmployee.status() === 200 && 
                responseEmployee.request().method() === 'POST'),
            await this.addEmployeeRecord.click()
        ]);
    }

   async clickOnDeleteEmployee(){
        await expect(this.deleteEmployeeIcon).toBeVisible();
        await this.deleteEmployeeIcon.click();
    }

    async verifyDeleteEmployeeForm(){
        await expect(this.deleteHeader).toBeVisible();
        await expect(this.deleteText).toBeVisible();
        await expect(this.deleteCancelButton).toBeVisible();
        await expect(this.deleteButton).toBeVisible();
        await this.deleteCancelButton.click();
    }

    async confirmDeleteEmployee(){
        await this.deleteButton.click();
        const [responseEmployee] = await Promise.all([
            this.page.waitForResponse(responseEmployee => 
                responseEmployee.url().includes('/Prod/api/employees/') && 
                responseEmployee.status() === 200 && 
                responseEmployee.request().method() === 'DELETE'),
            await this.deleteButton.click()
        ]);
    }

    async updateEmployee(){
        const randomDependent = Math.floor(Math.random() * 33);
        await this.editEmployeeIcon.click();
        await this.dependentsField.clear();
        await this.dependentsField.fill(randomDependent.toString());
        const [responseEmployee] = await Promise.all([
            this.page.waitForResponse(responseEmployee => 
                responseEmployee.url().includes('/Prod/api/employees') && 
                responseEmployee.status() === 200 && 
                responseEmployee.request().method() === 'PUT'),
            await this.updateEmployeeButton.click()
        ]);
    }

}
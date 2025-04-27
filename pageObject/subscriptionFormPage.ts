import { Page, expect } from '@playwright/test';
import { FORM_CONSTANTS } from './constants';

export class SubscriptionFormPage {
    private page: Page;

    // Локаторы элементов формы
    private nameInput = FORM_CONSTANTS.SELECTORS.NAME_INPUT;
    private emailInput = FORM_CONSTANTS.SELECTORS.EMAIL_INPUT;
    private serviceSelect = FORM_CONSTANTS.SELECTORS.SERVICE_SELECT;
    private purposeBusiness = FORM_CONSTANTS.SELECTORS.PURPOSE_BUSINESS;
    private purposePersonal = FORM_CONSTANTS.SELECTORS.PURPOSE_PERSONAL;
    private withdrawCash = FORM_CONSTANTS.SELECTORS.WITHDRAW_CASH;
    private withdrawCard = FORM_CONSTANTS.SELECTORS.WITHDRAW_CARD;
    private withdrawCrypto = FORM_CONSTANTS.SELECTORS.WITHDRAW_CRYPTO;
    private messageTextarea = FORM_CONSTANTS.SELECTORS.MESSAGE_TEXTAREA;
    private submitButton = FORM_CONSTANTS.SELECTORS.SUBMIT_BUTTON;
    private formStatus = FORM_CONSTANTS.SELECTORS.FORM_STATUS;

    constructor(page: Page) {
        this.page = page;
    }

    // Методы для взаимодействия с формой
    async fillName(name: string): Promise<void> {
        await this.page.fill(this.nameInput, name);
    }

    async fillEmail(email: string): Promise<void> {
        await this.page.fill(this.emailInput, email);
    }

    async selectService(service: string): Promise<void> {
        await this.page.selectOption(this.serviceSelect, service);
    }

    async selectPurpose(purpose: typeof FORM_CONSTANTS.VALUES.PURPOSE_OPTIONS[number]): Promise<void> {
        const selector = purpose === FORM_CONSTANTS.VALUES.PURPOSE_OPTIONS[0] ? this.purposeBusiness : this.purposePersonal;
        await this.page.check(selector);
    }

    async selectWithdrawalOptions(options: typeof FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[number][]): Promise<void> {
        for (const option of options) {
            let selector = '';
            switch (option) {
                case 'Cash':
                    selector = this.withdrawCash;
                    break;
                case 'Card':
                    selector = this.withdrawCard;
                    break;
                case 'Cryptocurrency':
                    selector = this.withdrawCrypto;
                    break;
            }
            
            if (!selector) {
                throw new Error(`Unknown withdrawal option: ${option}`);
            }

            // Добавляем явное ожидание видимости элемента
            await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
            // Проверяем текущее состояние чекбокса
            const isChecked = await this.page.isChecked(selector);
            // Если чекбокс не отмечен, отмечаем его
            if (!isChecked) {
                await this.page.check(selector, { force: true });
            }
        }
    }

    async fillMessage(message: string): Promise<void> {
        await this.page.fill(this.messageTextarea, message);
    }

    async submitForm(): Promise<void> {
        await this.page.locator(this.submitButton).waitFor({ state: 'visible', timeout: 5000 });
        await this.page.click(this.submitButton);
    }

    // Методы для проверки состояния формы
    async isNameInputEmpty(): Promise<boolean> {
        const value = await this.page.inputValue(this.nameInput);
        return value === '';
    }

    async isEmailInputEmpty(): Promise<boolean> {
        const value = await this.page.inputValue(this.emailInput);
        return value === '';
    }

    async isServiceSelected(): Promise<boolean> {
        const selectedValue = await this.page.inputValue(this.serviceSelect);
        return selectedValue !== FORM_CONSTANTS.VALUES.DEFAULT_SERVICE;
    }

    async isPurposeSelected(): Promise<boolean> {
        const businessSelected = await this.page.isChecked(this.purposeBusiness);
        const personalSelected = await this.page.isChecked(this.purposePersonal);
        return businessSelected || personalSelected;
    }

    async isWithdrawalOptionSelected(option: typeof FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[number]): Promise<boolean> {
        let selector = '';
        switch (option) {
            case FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[0]:
                selector = this.withdrawCash;
                break;
            case FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[1]:
                selector = this.withdrawCard;
                break;
            case FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[2]:
                selector = this.withdrawCrypto;
                break;
            default:
                throw new Error(`Unknown withdrawal option: ${option}`);
        }

        await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
        return await this.page.isChecked(selector);
    }

    async isFormSubmitted(): Promise<boolean> {
        try {
            // Проверяем видимость статуса формы
            const status = await this.page.isVisible(this.formStatus);
            if (!status) {
                return false;
            }

            // Получаем текст статуса
            const statusText = await this.page.textContent(this.formStatus);
            
            // Проверяем, что текст содержит сообщение об успешной отправке
            return statusText !== null && statusText.includes('Форма отправлена');
        } catch (error) {
            return false;
        }
    }

    // Метод для заполнения формы всеми полями
    async fillForm(
        name: string,
        email: string,
        service: string,
        purpose: typeof FORM_CONSTANTS.VALUES.PURPOSE_OPTIONS[number],
        withdrawalOptions: typeof FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[number][],
        message: string
    ): Promise<void> {
        await this.fillName(name);
        await this.fillEmail(email);
        await this.selectService(service);
        await this.selectPurpose(purpose);
        await this.selectWithdrawalOptions(withdrawalOptions);
        await this.fillMessage(message);
    }

    // Методы для валидации данных
    async validateEmailFormat(email: string): Promise<boolean> {
        return FORM_CONSTANTS.REGEX.EMAIL.test(email);
    }

    async validateNameFormat(name: string): Promise<boolean> {
        return name.length >= FORM_CONSTANTS.VALUES.VALID_NAME_MIN_LENGTH && name.trim() !== '';
    }

    async validateMessageLength(message: string): Promise<boolean> {
        return message.length >= FORM_CONSTANTS.VALUES.VALID_MESSAGE_MIN_LENGTH;
    }

    async scrollToForm(): Promise<void> {
        await this.page.locator(this.nameInput).scrollIntoViewIfNeeded();
        await this.page.locator(this.nameInput).waitFor({ state: 'visible', timeout: 5000 });
    }

    // Методы для проверки видимости элементов
    async isNameInputVisible(): Promise<boolean> {
        return await this.page.isVisible(this.nameInput);
    }

    async isEmailInputVisible(): Promise<boolean> {
        return await this.page.isVisible(this.emailInput);
    }

    async isServiceSelectVisible(): Promise<boolean> {
        return await this.page.isVisible(this.serviceSelect);
    }

    async isPurposeBusinessVisible(): Promise<boolean> {
        return await this.page.isVisible(this.purposeBusiness);
    }

    async isPurposePersonalVisible(): Promise<boolean> {
        return await this.page.isVisible(this.purposePersonal);
    }

    async isMessageTextareaVisible(): Promise<boolean> {
        return await this.page.isVisible(this.messageTextarea);
    }

    async isSubmitButtonVisible(): Promise<boolean> {
        return await this.page.isVisible(this.submitButton);
    }

    async isWithdrawCashVisible(): Promise<boolean> {
        return await this.page.isVisible(this.withdrawCash);
    }

    async isWithdrawCardVisible(): Promise<boolean> {
        return await this.page.isVisible(this.withdrawCard);
    }

    async isWithdrawCryptoVisible(): Promise<boolean> {
        return await this.page.isVisible(this.withdrawCrypto);
    }
}
import { test, expect } from '@playwright/test';
import { SubscriptionFormPage } from '../pageObject/subscriptionFormPage';
import { TEST_DATA } from './testData';
import { FORM_CONSTANTS, SUBMIT_BUTTON_TEXT } from '../pageObject/constants';

test.describe('Subscription Form Tests', () => {
    let subscriptionFormPage: SubscriptionFormPage;

    test.beforeEach(async ({ page }) => {
        subscriptionFormPage = new SubscriptionFormPage(page);
        await page.goto('https://qatest.datasub.com/');
    });


    // Happy path test
    test('should successfully submit the form with valid data', async () => {
        const { 
            NAME, 
            EMAIL,  
            SERVICE, 
            PURPOSE, 
            WITHDRAWAL_OPTIONS, 
            MESSAGE 
        } = TEST_DATA.VALID;

        // Скроллим до формы и ждем ее видимости
        await subscriptionFormPage.scrollToForm();

        // Проверяем видимость всех элементов формы
        expect(await subscriptionFormPage.isNameInputVisible(), `Поле "${FORM_CONSTANTS.FIELD_NAMES.NAME}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isEmailInputVisible(), `Поле "${FORM_CONSTANTS.FIELD_NAMES.EMAIL}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isServiceSelectVisible(), `Поле "${FORM_CONSTANTS.FIELD_NAMES.SERVICE}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isPurposeBusinessVisible(), `radio button "${FORM_CONSTANTS.FIELD_NAMES.PURPOSE_BUSINESS}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isPurposePersonalVisible(), `radio button "${FORM_CONSTANTS.FIELD_NAMES.PURPOSE_PERSONAL}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isMessageTextareaVisible(), `Поле "${FORM_CONSTANTS.FIELD_NAMES.MESSAGE}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isSubmitButtonVisible(), `Кнопка "${SUBMIT_BUTTON_TEXT}" должна быть видимой`).toBe(true);
        expect(await subscriptionFormPage.isWithdrawCashVisible(), `Чекбокс "${FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[0]}" должен быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isWithdrawCardVisible(), `Чекбокс "${FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[1]}" должен быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isWithdrawCryptoVisible(), `Чекбокс "${FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[2]}" должен быть видимым`).toBe(true);

        // Заполняем форму
        await subscriptionFormPage.fillForm(NAME, EMAIL, SERVICE, PURPOSE, WITHDRAWAL_OPTIONS, MESSAGE);

        // Проверяем, что выбрана цель формы
        expect(await subscriptionFormPage.isPurposeSelected(), `radio button "${FORM_CONSTANTS.FIELD_NAMES.PURPOSE_BUSINESS}" должен быть выбран`).toBe(true);

        // Проверяем, что выбран сервис
        expect(await subscriptionFormPage.isServiceSelected(), `select "${FORM_CONSTANTS.FIELD_NAMES.SERVICE}" должен быть выбран`).toBe(true);

        // Проверяем, что выбраны способы вывода средств
        for (const option of WITHDRAWAL_OPTIONS) {
            expect(await subscriptionFormPage.isWithdrawalOptionSelected(option), `checkbox "${option}" должен быть выбран`).toBe(true);
        }

        // Проверяем валидацию данных
        expect(await subscriptionFormPage.validateEmailFormat(EMAIL), 'Email должен быть валидным').toBe(true);
        expect(await subscriptionFormPage.validateNameFormat(NAME), 'Name должен быть валидным').toBe(true);
        expect(await subscriptionFormPage.validateMessageLength(MESSAGE), 'Message должен быть валидным').toBe(true);

        // Отправляем форму
        await subscriptionFormPage.submitForm();

        // Проверяем успешную отправку
        expect(await subscriptionFormPage.isFormSubmitted()).toBe(true);
    });

    // Negative test
    test('should show validation errors with invalid data', async () => {
        const {
            NAME,
            EMAIL,
            SERVICE,
            PURPOSE,
            WITHDRAWAL_OPTIONS,
            MESSAGE
        } = TEST_DATA.INVALID;

        // Скроллим до формы и ждем ее видимости
        await subscriptionFormPage.scrollToForm();

        // Проверяем видимость всех элементов формы
        expect(await subscriptionFormPage.isNameInputVisible(), `Поле "${FORM_CONSTANTS.FIELD_NAMES.NAME}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isEmailInputVisible(), `Поле "${FORM_CONSTANTS.FIELD_NAMES.EMAIL}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isServiceSelectVisible(), `Поле "${FORM_CONSTANTS.FIELD_NAMES.SERVICE}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isPurposeBusinessVisible(), `radio button "${FORM_CONSTANTS.FIELD_NAMES.PURPOSE_BUSINESS}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isPurposePersonalVisible(), `radio button "${FORM_CONSTANTS.FIELD_NAMES.PURPOSE_PERSONAL}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isMessageTextareaVisible(), `Поле "${FORM_CONSTANTS.FIELD_NAMES.MESSAGE}" должно быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isSubmitButtonVisible(), `Кнопка "${SUBMIT_BUTTON_TEXT}" должна быть видимой`).toBe(true);
        expect(await subscriptionFormPage.isWithdrawCashVisible(), `Чекбокс "${FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[0]}" должен быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isWithdrawCardVisible(), `Чекбокс "${FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[1]}" должен быть видимым`).toBe(true);
        expect(await subscriptionFormPage.isWithdrawCryptoVisible(), `Чекбокс "${FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[2]}" должен быть видимым`).toBe(true);


        // Проверяем, что цель формы не выбрана
        expect(await subscriptionFormPage.isPurposeSelected()).toBe(false);

        // Проверяем, что сервис не выбран
        expect(await subscriptionFormPage.isServiceSelected()).toBe(false);

        // Проверяем, что способы вывода средств не выбраны
        for (const option of FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS) {
            expect(await subscriptionFormPage.isWithdrawalOptionSelected(option), `checkbox "${option}" должен быть выбран`).toBe(false);
        }

        // Заполняем форму невалидными данными
        await subscriptionFormPage.fillForm(NAME, EMAIL, SERVICE, PURPOSE, WITHDRAWAL_OPTIONS, MESSAGE);

        // Проверяем валидацию данных
        expect(await subscriptionFormPage.validateEmailFormat(EMAIL), 'Email должен быть невалидным').toBe(false);
        expect(await subscriptionFormPage.validateNameFormat(NAME), 'Name должен быть невалидным').toBe(false);
        expect(await subscriptionFormPage.validateMessageLength(MESSAGE), 'Message должен быть невалидным').toBe(false);

        // Пытаемся отправить форму
        await subscriptionFormPage.submitForm();

        // Проверяем, что форма не отправлена
        expect(await subscriptionFormPage.isFormSubmitted()).toBe(false);
    });
});
import { FORM_CONSTANTS } from '../pageObject/constants';

export const TEST_DATA = {
    // Валидные данные
    VALID: {
        NAME: 'Иван Тестов',
        EMAIL: 'aqa@test.com',
        SERVICE: 'B Service',
        PURPOSE: FORM_CONSTANTS.VALUES.PURPOSE_OPTIONS[0],
        WITHDRAWAL_OPTIONS: [FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[0], FORM_CONSTANTS.VALUES.WITHDRAWAL_OPTIONS[1]],
        MESSAGE: 'Ничего не надо, я просто раннер Playwright'
    },

    // Невалидные данные
    INVALID: {
        NAME: 'A', // слишком короткое имя
        EMAIL: 'invalid-email', // неверный формат email
        SERVICE: FORM_CONSTANTS.VALUES.DEFAULT_SERVICE, // не выбрана услуга
        PURPOSE: FORM_CONSTANTS.VALUES.PURPOSE_OPTIONS[0],
        WITHDRAWAL_OPTIONS: [],
        MESSAGE: 'PW' // слишком короткое сообщение
    },

    // Пределы валидации
    VALIDATION: {
        MIN_NAME_LENGTH: FORM_CONSTANTS.VALUES.VALID_NAME_MIN_LENGTH,
        MIN_MESSAGE_LENGTH: FORM_CONSTANTS.VALUES.VALID_MESSAGE_MIN_LENGTH
    }
};
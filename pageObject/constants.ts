export const SUBMIT_BUTTON_TEXT = 'Request A Quote'

export const FORM_CONSTANTS = {
    // Значения
    VALUES: {
        DEFAULT_SERVICE: 'A Service',
        VALID_NAME_MIN_LENGTH: 2,
        VALID_MESSAGE_MIN_LENGTH: 10,
        WITHDRAWAL_OPTIONS: ['Cash', 'Card', 'Cryptocurrency'] as const,
        PURPOSE_OPTIONS: ['Business', 'Personal'] as const,
    },

    // Селекторы
    SELECTORS: {
        NAME_INPUT: '#name',
        EMAIL_INPUT: '#email',
        SERVICE_SELECT: '#service',
        PURPOSE_BUSINESS: '#purposeBusiness',
        PURPOSE_PERSONAL: '#purposePersonal',
        WITHDRAW_CASH: '#withdrawCash',
        WITHDRAW_CARD: '#withdrawCard',
        WITHDRAW_CRYPTO: '#withdrawCrypto',
        MESSAGE_TEXTAREA: '#message',
        SUBMIT_BUTTON: `button[type="submit"]:has-text("${SUBMIT_BUTTON_TEXT}")`,
        FORM_STATUS: '#formStatus'
    },

    // Имена полей
    FIELD_NAMES: {
        NAME: 'Name',
        EMAIL: 'Email',
        SERVICE: 'Service',
        PURPOSE_BUSINESS: 'Business',
        PURPOSE_PERSONAL: 'Personal',
        WITHDRAW_CASH: 'Cash',
        WITHDRAW_CARD: 'Card',
        WITHDRAW_CRYPTO: 'Cryptocurrency',
        MESSAGE: 'Message'
    },

    // Регулярные выражения
    REGEX: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
};
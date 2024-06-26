import { MAX_MUSICIANS_COUNT } from './constants';

interface Errors {
    validations: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

export default <Errors>{
    validations: {
        // Auth
        name: {
            required: 'Please enter your name',
        },
        email: {
            required: 'Please enter an email',
            email: 'Not a valid email address',
            unique: 'Email already in use',
            async: 'Invalid login credentials. Please check your email or password',
            not_found: 'No account found with that email',
        },
        contact_num: {
            required: 'Please enter a phone number',
            mask: 'Not a valid phone number',
        },
        password: {
            required: 'Please enter a password',
        },
        confirm_password: {
            required: 'Please confirm your password',
        },

        // OTP
        otp: {
            required: 'Please enter a code',
            invalid: 'Code has expired or is invalid',
        },

        // Bookings
        customer_type: {
            required: 'Please choose one',
        },
        booked_for: {
            required: 'Please select the customer',
        },
        date_booked: {
            required: 'Please select a date',
        },
        time_booked: {
            required: 'Please select a time',
            range: 'Time can only be between 8:00AM to 8:00PM',
        },
        duration_in_minutes: {
            required: 'Please select a duration',
        },
        num_of_musicians: {
            required: 'Please enter an amount',
        },
    },
};

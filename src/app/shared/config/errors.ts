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
        email: {
            required: 'Please enter an email',
            email: 'Not a valid email address',
            unique: 'Email already in use',
        },
        password: {
            required: 'Please enter a password',
        },
        confirm_password: {
            required: 'Please confirm your password',
        },

        // Bookings
        customer_type: {
            required: 'Please select your customer type',
        },
        booked_for: {
            required: 'Please select the customer',
        },
        date_booked: {
            required: 'Please select a date',
        },
        time_booked: {
            required: 'Please select a time',
        },
        duration_in_minutes: {
            required: 'Please select a duration',
        },
        num_of_musicians: {
            required: 'Please enter an amount',
        },
    },
};

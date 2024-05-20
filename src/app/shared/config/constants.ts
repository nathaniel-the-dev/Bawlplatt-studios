export const SITE_NAME = 'Bawlplatt Studios';

export const BOOKING_DURATIONS = [
    { value: 30, label: '30 mins.' },
    { value: 60, label: '1 hr.' },
    { value: 120, label: '2 hrs.' },
    { value: 180, label: '3 hrs.' },
    { value: 240, label: '4 hrs.' },
];

export const AVAILABLE_EQUIPMENT = {
    guitars: {
        limit: 3,
        icon: 'guitar',
    },
    drums: { limit: 2, icon: 'drum' },
    pianos: { limit: 2, icon: 'piano' },
    bass: { limit: 1, icon: 'speaker' },
    microphones: { limit: 5, icon: 'mic2' },
};

export const MAX_MUSICIANS_COUNT = 10;

import { INavbarData } from "./helper";

// All routes in the navbar are defined here
export const navbarData: INavbarData[] = [
    {
        routeLink: 'calendar',      // where to link "http://.../dashboard"
        icon: 'far fa-calendar-alt', // the icon which is used in the navbar
        label: 'date-view',          // the name of the translation
        role: [1, 2, 4, 5, 7]            // the roles that are needed
    },
    {
        routeLink: 'mainList',
        icon: 'fal fa-list',
        label: 'MAIN-LIST',
        role: [1, 2, 3, 4, 5, 6, 7]
    },
    {
        routeLink: 'customer-requirements',
        icon: 'fas fa-envelope-open-text',
        label: 'req-tech',
        role: [1, 2, 3, 4, 6, 7]
    },
    {
        routeLink: 'visitor-registration',
        icon: 'fal fa-users',
        label: 'req-visitors',
        role: [1, 2, 3, 5, 6, 7]
    },
    {
        routeLink: 'seminar-registration',
        icon: 'fal fa-book',
        label: 'req-workshop',
        role: [1, 2, 3, 5, 6, 7]
    },/*
    {
        routeLink: 'booking-request',
        icon: 'fal fa-plane',
        label: 'bookingRequest',
        role: [1, 2, 3, 4, 7]
    },*/
    {
        routeLink: 'abschluss-bericht-list',
        icon: 'fal fa-clipboard-list',
        label: 'final-reports',
        role: [1, 2, 3, 4, 6, 7]
    },
    {
        routeLink: "",
        icon: 'fal fa-user-plus',
        label: 'new',
        role: [1, 7],
        items: [
            {
                routeLink: 'create-technologist',
                label: 'new-tech',
            },
            {
                routeLink: 'create-representative',
                label: 'new-re',
            },
            {
                routeLink: 'create-dealer',
                label: 'new-de',
            },
            {
                routeLink: 'create-new-group',
                label: 'new-group',
            }
        ]
    },
    {
        routeLink: 'bug-report',
        icon: 'fas fa-exclamation',
        label: 'support',
        role: [1, 2, 5, 7]
    }
];

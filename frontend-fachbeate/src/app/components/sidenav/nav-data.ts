import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'far fa-calendar-alt',
        label: 'date-view'
    },
    {
        routeLink: 'mainList',
        icon: 'fal fa-list',
        label: 'MAIN-LIST'
    },
    {
        routeLink: 'customer-requirements',
        icon: 'fas fa-envelope-open-text',
        label: 'req-tech'
    },
    {
        routeLink: 'visitorRegistration',
        icon: 'fal fa-users',
        label: 'req-visitors'
    },
    {
        routeLink: 'seminar-registration',
        icon: 'fal fa-book',
        label: 'req-workshop'
    },
    {
        routeLink: 'app-abschluss-bericht-list',
        icon: 'fal fa-clipboard-list',
        label: 'final-reports'
    },
    {
        routeLink: "",
        icon: 'fal fa-user-plus',
        label: 'new',
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
            }
        ]
    }
];
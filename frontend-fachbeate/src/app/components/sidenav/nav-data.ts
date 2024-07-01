import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'far fa-calendar-alt',
        label: 'date-view',
        role: [1,2,4,5,7]
    },
    {
        routeLink: 'mainList',
        icon: 'fal fa-list',
        label: 'MAIN-LIST',
        role: [1,2,3,4,5,6,7]
    },
    {
        routeLink: 'customer-requirements',
        icon: 'fas fa-envelope-open-text',
        label: 'req-tech',
        role: [1,2,3,4,6,7]
    },
    {
        routeLink: 'visitorRegistration',
        icon: 'fal fa-users',
        label: 'req-visitors',
        role: [1,2,3,5,6,7]
    },
    {
        routeLink: 'seminar-registration',
        icon: 'fal fa-book',
        label: 'req-workshop',
        role: [1,2,3,5,6,7]
    },
    {
        routeLink: 'app-abschluss-bericht-list',
        icon: 'fal fa-clipboard-list',
        label: 'final-reports',
        role: [1,2,3,4,7]
    },
    {
        routeLink: "",
        icon: 'fal fa-user-plus',
        label: 'new',
        role: [1,7],
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
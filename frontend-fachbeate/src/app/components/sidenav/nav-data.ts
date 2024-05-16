import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'far fa-calendar-alt',
        label: 'Terminübersicht'
    },
    {
        routeLink: 'mainList',
        icon: 'fal fa-list',
        label: 'Terminliste'
    },
    {
        routeLink: 'customer-requirements',
        icon: 'fas fa-envelope-open-text',
        label: 'Anforderungen Technologische Unterstützung'
    },
    {
        routeLink: 'travelreport',
        icon: 'fal fa-plane',
        label: 'Reisebericht'
    },
    {
        routeLink: 'seminar-registration',
        icon: 'fal fa-book',
        label: 'Seminar Anmeldung'
    },
];
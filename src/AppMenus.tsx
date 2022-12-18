
export interface IPassMenu {
    order: number;
    title: string;
    path: string;
    description?: string;
    showOnToolbar?: boolean,
    isMainRoute?: boolean,
    childs: IPassMenu[];
}

const unSortedMenues: IPassMenu[] = [
    {
        order: 1,
        title: 'Dashboard',
        path: 'dashboard',
        //description: 'summary of memories',
        showOnToolbar: false,
        childs: [
            {
            order: 1,
            title: 'Dashboard',
            path: '',
            description: '',
            showOnToolbar: true,
            childs: []
        },]
    },
    {
        order: 2,
        title: 'Memory',
        path: 'memory',
        description: 'and memory types',
        showOnToolbar: false,
        childs: [
            {
                order: 1,
                title: 'Memory',
                path: '',
                description: '',
                showOnToolbar: true,
                childs: []
            },
            {
                order: 3,
                title: 'Memory Type',
                path: '/type',
                description: '',
                showOnToolbar: false,
                childs: []
            }
        ]
    },
    {
        order: 3,
        title: 'Organization',
        path: 'organization',
        description: 'and organization types',
        showOnToolbar: false,
        childs: [
            {
                order: 1,
                title: 'Organization',
                path: '/',
                description: '',
                showOnToolbar: true,
                childs: []
            },
            {
                order: 2,
                title: 'Organization Type',
                path: '/type',
                description: '',
                showOnToolbar: false,
                childs: []
            }

        ]
    },
    {
        order: 5,
        title: 'Environment Types',
        path: 'environment-type',
        showOnToolbar: false,
        childs: [{
            order: 1,
            title: 'Environment Types',
            path: '',
            description: '',
            showOnToolbar: true,
            childs: []
        }
        ]
    },
    {
        order: 5,
        title: 'Tenants',
        path: 'tenants',
        showOnToolbar: false,
        childs: [{
            order: 1,
            title: 'Tenants',
            path: '',
            description: '',
            showOnToolbar: true,
            childs: []
        }
        ]
    }
];
const menus: readonly IPassMenu[] = unSortedMenues.sort((a, b) => (a.order < b.order) ? -1 : 1);

export default menus;
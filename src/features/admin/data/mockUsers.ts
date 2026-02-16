export interface User {
    id: string;
    nombre: string;
    email: string;
    rol: 'Administrador' | 'Entrenador' | 'Recepción';
    avatar?: string;
}

export const MOCK_USERS: User[] = [
    {
        id: '1',
        nombre: 'Juan Perez',
        email: 'juan@lomasfight.com',
        rol: 'Administrador',
        avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=random'
    },
    {
        id: '2',
        nombre: 'Maria Rodriguez',
        email: 'm.rodriguez@lomasfight.com',
        rol: 'Entrenador',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=random'
    },
    {
        id: '3',
        nombre: 'Carlos Garcia',
        email: 'carlos.g@lomasfight.com',
        rol: 'Recepción',
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Garcia&background=random'
    }
];

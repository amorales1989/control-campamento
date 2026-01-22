import { createRouter, createWebHistory } from 'vue-router';
import CampControl from '../views/CampControl.vue';
import HealthForm from '../views/HealthForm.vue';

const routes = [
    {
        path: '/',
        name: 'CampControl',
        component: CampControl
    },
    {
        path: '/ficha-medica',
        name: 'HealthForm',
        component: HealthForm
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

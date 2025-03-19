import { Routes } from '@angular/router';
import { ToolsPage } from './pages/tools/tools.page';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
    {
        path: 'timer',
        component: ToolsPage,
    },
    {
        path: 'home',
        component: HomePage,
    },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",
        loadComponent:()=>import("../app/notification/notification.component").then((c)=>c.NotificationComponent)
    }
];

[33mcommit dd619df17e5bfbbbf79f9ade4233ccb7da4fbe24[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mfeature/stage-11-dentist-services-settings[m[33m, [m[1;31morigin/feature/stage-11-dentist-services-settings[m[33m)[m
Author: zelalem yibabe <zelalemybabe77@gmail.com>
Date:   Wed Aug 19 02:12:23 2026 +0300

    feat(stage-11): add dentist, service, notification, settings, and audit management
    
    - Complete dentist management with stats and schedule endpoints
    - Service catalog management with CRUD operations
    - User-scoped notification system with read/unread tracking
    - Clinic settings management with key-value pairs and bulk updates
    - Audit log viewing with filtering by user, action, entity, and date
    - Database seed script with sample users and data
    - 4 new validators for input validation
    - All routes secured with role-based access control

[33mcommit 654612327770426c042ff3d6273b2cd44495ba2a[m[33m ([m[1;32mfeature/stage-10-frontend-billing[m[33m, [m[1;32mdevelop[m[33m)[m
Author: zelalem yibabe <zelalemybabe77@gmail.com>
Date:   Tue Aug 18 17:08:41 2026 +0300

    feat(stage-9): add treatment, billing, and financial services
    
    - Treatment plans and records management with audit logging
    - Invoice generation with auto-calculations and status tracking
    - Payment tracking with partial payment support and balance validation
    - Expense management with category filtering
    - Financial reporting: revenue summaries, analytics, and dashboard stats
    - All endpoints secured with role-based access control

[33mcommit 2437c7943bbe12155d2ad8d77b816c5f3d4ccba2[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/feature/stage-9-treatment-billing[m[33m, [m[1;31morigin/develop[m[33m, [m[1;31morigin/HEAD[m[33m, [m[1;32mmain[m[33m, [m[1;32mfeature/stage-9-treatment-billing[m[33m)[m
Author: zelalem yibabe <zelalemybabe77@gmail.com>
Date:   Tue Aug 18 16:42:37 2026 +0300

    feat: initial project setup (Stages 1-8)
    
    - Project structure with backend/frontend separation
    - Backend: Express.js layered architecture, MongoDB models, auth, validation
    - Frontend: Vite + React with plain CSS design system
    - Authentication system with JWT and HTTP-only cookies
    - Patient and Appointment management APIs
    - Premium dental clinic UI with Lucide icons

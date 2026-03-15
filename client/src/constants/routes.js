/* ========================================
   Application Routes
   Central place for all navigation paths
======================================== */

export const ROUTES = {
    /* ========================
       Auth
    ======================== */

    LOGIN: "/login",
    SIGNUP: "/signup",

    /* ========================
       Main
    ======================== */

    HOME: "/home",

    /* ========================
       Personnel
    ======================== */

    PERSONNEL_MANAGEMENT: "/personnel-management",

    COMPANY_HQ: "/personnel/company-hq",

    PLATOONS: "/personnel/platoons",

    PLATOON: (platoonId) => `/personnel/platoons/${platoonId}`,

    SQUAD: (platoonId, squadId) =>
        `/personnel/platoons/${platoonId}/squads/${squadId}`,

    /* ========================
       Smart navigation
    ======================== */

    PM_ROUTE: (user) => {
        if (!user) return "/login";

        if (user.positionLevel === "company")
            return ROUTES.PERSONNEL_MANAGEMENT;

        if (user.positionLevel === "platoon")
            return ROUTES.PLATOON(user.platoonId);

        if (user.positionLevel === "squad")
            return ROUTES.SQUAD(user.platoonId, user.squadId);

        return ROUTES.HOME;
    },

    /* ========================
       Route permissions
    ======================== */

    CAN_ACCESS_ROUTE: (user, route) => {
        if (!user) return false;

        const level = user.positionLevel;

        /* Company commander */
        if (level === "company") return true;

        /* Platoon commander */
        if (level === "platoon") {
            return (
                route.startsWith("/personnel/platoons")
            );
        }

        /* Squad commander */
        if (level === "squad") {
            return (
                route.includes("/squads/")
            );
        }

        return false;
    },

    /* ========================
       Debug
    ======================== */

    DB_DEBUG: "/db-debug",
};
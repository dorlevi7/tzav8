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

        if (
            user.positionLevel === "platoon_commander" ||
            user.positionLevel === "platoon_sergeant"
        )
            return ROUTES.PLATOON(user.platoonId);

        if (user.positionLevel === "squad_commander")
            return ROUTES.SQUAD(user.platoonId, user.squadId);

        return ROUTES.HOME;
    },

    /* ========================
       Visibility rules
       Should the button appear?
    ======================== */

    CAN_SEE_PM: (user) => {
        if (!user) return false;

        return (
            user.positionLevel === "company" ||
            user.positionLevel === "platoon_commander" ||
            user.positionLevel === "platoon_sergeant" ||
            user.positionLevel === "squad_commander"
        );
    },

    /* ========================
       Route permissions
    ======================== */

    CAN_ACCESS_ROUTE: (user, route) => {
        if (!user) return false;

        const level = user.positionLevel;

        /* Company commander */
        if (level === "company") return true;

        /* Platoon level */
        if (
            level === "platoon_commander" ||
            level === "platoon_sergeant"
        ) {
            return route.startsWith("/personnel/platoons");
        }

        /* Squad commander */
        if (level === "squad_commander") {
            return route.includes("/squads/");
        }

        return false;
    },

    /* ========================
       Debug
    ======================== */

    DB_DEBUG: "/db-debug",
};
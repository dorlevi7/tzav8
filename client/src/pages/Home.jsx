import "../styles/pages/Home.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function Home() {
  const { t } = useTranslation();
  const { loading, setLoading } = useLoading();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  usePageTitle(t("home.title"));

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [setLoading]);

  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;

  /* ========================
     Don't render screen while loading
  ======================== */

  if (loading) {
    return null;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1>{t("home.title")}</h1>

          {user && (
            <p className="welcome-text">
              {t("home.welcome", { username: fullName })}
            </p>
          )}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card user-card">
            <h3>{t("home.userDetails")}</h3>

            {user && (
              <>
                <p>
                  <strong>{t("home.name")}:</strong> {fullName}
                </p>

                <p>
                  <strong>{t("home.rank")}:</strong>{" "}
                  {user.rank ? t(`ranks.${user.rank}`) : "-"}
                </p>

                <p>
                  <strong>{t("home.role")}:</strong> {user.role}
                </p>

                <p>
                  <strong>{t("home.companyId")}:</strong>{" "}
                  {user.companyId || "-"}
                </p>

                <p>
                  <strong>{t("home.userId")}:</strong> {user.id}
                </p>
              </>
            )}
          </div>

          <div className="dashboard-card">
            <h3>{t("home.upcomingEvents")}</h3>
            <p>{t("home.noEvents")}</p>
          </div>

          <div className="dashboard-card">
            <h3>{t("home.activeTasks")}</h3>
            <p>{t("home.noTasks")}</p>
          </div>

          <div className="dashboard-card">
            <h3>{t("home.qualifications")}</h3>
            <p>{t("home.allValid")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

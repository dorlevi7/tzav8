import "../styles/pages/Home.css";

import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";

function Home() {
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Update browser tab title
  usePageTitle(t("home.title"));

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1>{t("home.title")}</h1>

          {user && (
            <p className="welcome-text">
              {t("home.welcome", { username: user.username })}
            </p>
          )}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card user-card">
            <h3>{t("home.userDetails")}</h3>

            {user && (
              <>
                <p>
                  <strong>{t("home.username")}:</strong> {user.username}
                </p>

                <p>
                  <strong>{t("home.role")}:</strong> {user.role}
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

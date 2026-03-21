import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";
import Loader from "../components/Loader";

function Home() {
  const { t } = useTranslation();
  const { loading, setLoading } = useLoading();

  /* ========================
     Safe user parsing
  ======================== */

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

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
     Loader
  ======================== */

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">{t("home.title")}</h1>

          {user && (
            <p className="page-subtitle">
              {t("home.welcome", { username: fullName })}
            </p>
          )}
        </div>

        <div className="page-section">
          <div className="cards-grid">
            <div className="card user-card">
              <h3>{t("home.userDetails")}</h3>

              {user && (
                <>
                  <p>
                    <strong>{t("home.name")}:</strong> {fullName || "-"}
                  </p>

                  <p>
                    <strong>{t("home.rank")}:</strong>{" "}
                    {user.rank ? t(`ranks.${user.rank}`) : "-"}
                  </p>

                  <p>
                    <strong>{t("home.role")}:</strong> {user.role || "-"}
                  </p>

                  <p>
                    <strong>{t("home.companyId")}:</strong>{" "}
                    {user.companyId || "-"}
                  </p>

                  <p>
                    <strong>{t("home.userId")}:</strong> {user.id || "-"}
                  </p>
                </>
              )}
            </div>

            <div className="card">
              <h3>{t("home.upcomingEvents")}</h3>
              <p>{t("home.noEvents")}</p>
            </div>

            <div className="card">
              <h3>{t("home.activeTasks")}</h3>
              <p>{t("home.noTasks")}</p>
            </div>

            <div className="card">
              <h3>{t("home.qualifications")}</h3>
              <p>{t("home.allValid")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

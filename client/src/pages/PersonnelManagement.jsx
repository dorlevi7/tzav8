import "../styles/pages/PersonnelManagement.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function PersonnelManagement() {
  const { t } = useTranslation();
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();

  usePageTitle(t("personnelManagement.title"));

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [setLoading]);

  /* ========================
     Don't render screen while loading
  ======================== */

  if (loading) {
    return null;
  }

  return (
    <div className="personnel-management-container">
      <div className="personnel-management-content">
        <div className="personnel-management-header">
          <h1>{t("personnelManagement.title")}</h1>
        </div>

        <div className="dashboard-grid">
          {/* Platoons */}
          <div className="dashboard-card">
            <h3>{t("personnelManagement.platoons")}</h3>

            <div className="card-actions">
              <button
                className="primary-button"
                onClick={() => navigate("/personnel/platoons")}
              >
                {t("common.manage")}
              </button>

              <button className="secondary-button" disabled>
                {t("common.view")}
              </button>
            </div>
          </div>

          {/* Company HQ */}
          <div className="dashboard-card">
            <h3>{t("personnelManagement.companyHQ")}</h3>

            <div className="card-actions">
              <button
                className="primary-button"
                onClick={() => navigate("/personnel/company-hq")}
              >
                {t("common.manage")}
              </button>

              <button className="secondary-button" disabled>
                {t("common.view")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonnelManagement;

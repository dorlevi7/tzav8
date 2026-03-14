import "../styles/pages/PersonnelManagement.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function CompanyHQManagement() {
  const { t } = useTranslation();
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();

  usePageTitle(t("companyHQManagement.title"));

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
    <div className="page-container">
      <div className="personnel-management-content">
        <div className="personnel-management-header">
          <h1>{t("companyHQManagement.title")}</h1>
          <p className="text-muted">{t("companyHQManagement.description")}</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>{t("companyHQManagement.staffOfficers")}</h3>

            <div className="card-actions">
              <button className="primary-button">{t("common.manage")}</button>

              <button className="secondary-button">{t("common.view")}</button>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>{t("companyHQManagement.hqSoldiers")}</h3>

            <div className="card-actions">
              <button className="primary-button">{t("common.manage")}</button>

              <button className="secondary-button">{t("common.view")}</button>
            </div>
          </div>
        </div>

        {/* Back button at bottom */}
        <div style={{ marginTop: "0px", textAlign: "center" }}>
          <button className="secondary-button" onClick={() => navigate(-1)}>
            ← {t("common.back")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyHQManagement;

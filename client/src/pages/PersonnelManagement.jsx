import "../styles/pages/PersonnelManagement.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function PersonnelManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  usePageTitle(t("personnelManagement.title"));

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [setLoading]);

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
              <button className="primary-button">{t("common.manage")}</button>

              <button className="secondary-button">{t("common.view")}</button>
            </div>
          </div>

          {/* Company HQ */}
          <div className="dashboard-card">
            <h3>{t("personnelManagement.companyHQ")}</h3>

            <div className="card-actions">
              <button className="primary-button">{t("common.manage")}</button>

              <button className="secondary-button">{t("common.view")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonnelManagement;

import "../styles/pages/PersonnelManagement.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function CompanyHQManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  usePageTitle(t("companyHQManagement.title"));

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
      </div>
    </div>
  );
}

export default CompanyHQManagement;

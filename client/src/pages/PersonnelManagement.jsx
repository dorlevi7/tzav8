import "../styles/pages/PersonnelManagement.css"; // ייבוא הקובץ החדש

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
        {/* Company HQ */}
        <div className="dashboard-card">
          <h3>{t("personnelManagement.companyHQ")}</h3>
          <p className="text-muted">{t("personnelManagement.companyHQDesc")}</p>
          <button>{t("personnelManagement.addCompanyRole")}</button>
        </div>

        {/* Platoons */}
        <div className="dashboard-card">
          <h3>{t("personnelManagement.platoons")}</h3>
          <p className="text-muted">{t("personnelManagement.platoonDesc")}</p>
          <button>{t("personnelManagement.createPlatoon")}</button>
        </div>

        {/* Squads */}
        <div className="dashboard-card">
          <h3>{t("personnelManagement.squads")}</h3>
          <p className="text-muted">{t("personnelManagement.squadDesc")}</p>
          <button>{t("personnelManagement.createSquad")}</button>
        </div>
      </div>
    </div>
  </div>
);
}

export default PersonnelManagement;

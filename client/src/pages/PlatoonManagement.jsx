import "../styles/pages/PersonnelManagement.css";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function PlatoonManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { platoonId } = useParams();

  usePageTitle(t("platoonManagement.title"));

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
        {/* Header */}
        <div className="personnel-management-header">
          <h1>{t("platoonManagement.title")}</h1>
        </div>

        {/* Add Buttons */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>{t("platoonManagement.addPersonnel")}</h3>

            <div className="card-actions">
              <button className="primary-button">
                {t("platoonManagement.addSergeant")}
              </button>

              <button className="primary-button">
                {t("platoonManagement.addCommander")}
              </button>

              <button className="primary-button">
                {t("platoonManagement.addSoldier")}
              </button>
            </div>
          </div>
        </div>

        {/* Platoon Sergeant */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>{t("platoonManagement.sergeant")}</h3>
          </div>

          <div className="table-placeholder">
            {t("platoonManagement.noSergeant")}
          </div>
        </div>

        {/* Squad Commanders */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>{t("platoonManagement.commanders")}</h3>
          </div>

          <div className="table-placeholder">
            {t("platoonManagement.noCommanders")}
          </div>
        </div>

        {/* Soldiers */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>{t("platoonManagement.soldiers")}</h3>
          </div>

          <div className="table-placeholder">
            {t("platoonManagement.noSoldiers")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatoonManagement;

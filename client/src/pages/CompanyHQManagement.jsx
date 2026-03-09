import "../styles/pages/PersonnelManagement.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function CompanyHQManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  usePageTitle("ניהול כ״א מפקדת הפלוגה");

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
          <h1>ניהול כ״א מפקדת הפלוגה</h1>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>קציני מטה</h3>

            <div className="card-actions">
              <button className="primary-button">נהל</button>

              <button className="secondary-button">צפה</button>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>חיילי מפקדה</h3>

            <div className="card-actions">
              <button className="primary-button">נהל</button>

              <button className="secondary-button">צפה</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyHQManagement;

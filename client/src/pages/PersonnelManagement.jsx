import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";
import Loader from "../components/Loader";
import { errorMap } from "../utils/errorMap";

function PersonnelManagement() {
  const { t } = useTranslation();
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total_soldiers: 0,
    total_platoons: 0,
    total_squads: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  usePageTitle(t("personnelManagement.title"));

  useEffect(() => {
    loadSummary();
  }, []);

  /* ========================
     Load company summary
  ======================== */

  const loadSummary = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.companyId) {
        throw new Error("Missing company ID");
      }

      const companyId = user.companyId;

      const response = await fetch(
        `${API_URL}/api/platoons/${companyId}/summary`,
      );

      let data = null;

      try {
        data = await response.json();
      } catch {}

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load summary");
      }

      setSummary(data);
    } catch (err) {
      console.error("Failed to load personnel summary:", err);

      const key = errorMap[err.message];

      toast.error(key ? t(key) : err.message || t("auth.serverError"));
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     Loader
  ======================== */

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">{t("personnelManagement.title")}</h1>
        </div>

        {/* Summary */}
        <div className="card">
          <div className="personnel-summary">
            <div className="summary-item">
              <span className="summary-label">
                {t("personnelManagement.totalSoldiers")}
              </span>
              <span className="summary-value">{summary.total_soldiers}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                {t("personnelManagement.totalPlatoons")}
              </span>
              <span className="summary-value">{summary.total_platoons}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                {t("personnelManagement.totalSquads")}
              </span>
              <span className="summary-value">{summary.total_squads}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="cards-grid">
          <div className="card">
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

          <div className="card">
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

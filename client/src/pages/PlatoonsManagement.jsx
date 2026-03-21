import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

import CreatePlatoonModal from "../components/modals/CreatePlatoonModal";
import Loader from "../components/Loader";
import { errorMap } from "../utils/errorMap";

function PlatoonsManagement() {
  const { t } = useTranslation();
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();

  const [platoons, setPlatoons] = useState([]);
  const [summary, setSummary] = useState({
    total_soldiers: 0,
    total_platoons: 0,
    total_squads: 0,
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  usePageTitle(t("platoonsManagement.title"));

  useEffect(() => {
    loadData();
  }, []);

  /* ========================
   LOAD ALL DATA
======================== */

const loadData = async () => {
  try {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.companyId) {
      throw new Error("Missing company ID");
    }

    const companyId = user.companyId;

    /* ========================
       Load platoons
    ======================== */

    const platoonsRes = await fetch(`${API_URL}/api/platoons/${companyId}`);

    let platoonsData;

    try {
      platoonsData = await platoonsRes.json();
    } catch {
      platoonsData = [];
    }

    if (!platoonsRes.ok) {
      throw new Error(platoonsData?.error || "Failed to load platoons");
    }

    setPlatoons(platoonsData);

    /* ========================
       Load summary
    ======================== */

    const summaryRes = await fetch(
      `${API_URL}/api/platoons/${companyId}/platoon-summary`,
    );

    let summaryData;

    try {
      summaryData = await summaryRes.json();
    } catch {
      summaryData = {};
    }

    if (!summaryRes.ok) {
      throw new Error(summaryData?.error || "Failed to load summary");
    }

    setSummary(summaryData);
  } catch (err) {
    console.error("Failed to load platoons:", err);
    const key = errorMap[err.message];

    toast.error(
      key
        ? t(key)
        : err.message && !err.message.includes("Failed")
          ? err.message
          : t("auth.serverError"),
    );
  } finally {
    setLoading(false);
  }
};

  /* ========================
     Calculate next platoon number
  ======================== */

  const nextPlatoonNumber = platoons.length + 1;

  /* ========================
     Don't render screen while loading
  ======================== */

  if (loading) return <Loader />;

  return (
    <>
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">{t("platoonsManagement.title")}</h1>
          </div>

          {/* ========================
             Summary
          ======================== */}

          {/* ========================
   Summary / General Info
======================== */}

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

          {/* ========================
             No platoons
          ======================== */}

          {platoons.length === 0 && (
            <div className="empty-state">
              <p>{t("platoonsManagement.noPlatoons")}</p>

              <button
                className="primary-button"
                onClick={() => setShowCreateModal(true)}
              >
                {t("platoonsManagement.createPlatoon")}
              </button>
            </div>
          )}

          {/* ========================
             Platoons list
          ======================== */}

          {platoons.length > 0 && (
            <div className="cards-grid">
              {platoons.map((platoon) => (
                <div className="card" key={platoon.id}>
                  <h3>
                    {t("platoonsManagement.platoon", {
                      number: platoon.number,
                    })}
                  </h3>

                  {platoon.name && <p>{platoon.name}</p>}

                  <div className="card-actions">
                    <button
                      className="primary-button"
                      onClick={() =>
                        navigate(`/personnel/platoons/${platoon.id}`)
                      }
                    >
                      {t("common.manage")}
                    </button>

                    <button className="secondary-button" disabled>
                      {t("common.view")}
                    </button>
                  </div>
                </div>
              ))}

              {/* Add platoon card */}

              <div className="card add-card">
                <button
                  className="primary-button"
                  onClick={() => setShowCreateModal(true)}
                >
                  + {t("platoonsManagement.createPlatoon")}
                </button>
              </div>
            </div>
          )}

          {/* Back button */}

          <div className="page-actions">
            <button className="secondary-button" onClick={() => navigate(-1)}>
              ← {t("common.back")}
            </button>
          </div>
        </div>
      </div>

      {/* Create Platoon Modal */}

      {showCreateModal && (
        <CreatePlatoonModal
          nextPlatoonNumber={nextPlatoonNumber}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            loadData();
            setShowCreateModal(false);
          }}
        />
      )}
    </>
  );
}

export default PlatoonsManagement;

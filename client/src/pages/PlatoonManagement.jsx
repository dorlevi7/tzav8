import "../styles/pages/PersonnelManagement.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

import AddPersonnelModal from "../components/modals/AddPersonnelModal";
import CreateSquadModal from "../components/modals/CreateSquadModal";

/* Miluim ranks – Sergeant and above */
const MILUIM_RANKS = [
  "sergeant",
  "staffSergeant",
  "sergeantFirstClass",
  "masterSergeant",
  "seniorMasterSergeant",
  "chiefMasterSergeant",
  "warrantOfficer",
];

function PlatoonManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { platoonId } = useParams();
  const navigate = useNavigate();

  const [modalType, setModalType] = useState(null);
  const [showCreateSquad, setShowCreateSquad] = useState(false);

  const [platoon, setPlatoon] = useState(null);
  const [squads, setSquads] = useState([]);
  const [squadsLoaded, setSquadsLoaded] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  usePageTitle(t("platoonManagement.title"));

  /* =========================
     Load all data
  ========================= */

  useEffect(() => {
    loadAllData();
  }, [platoonId]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setSquadsLoaded(false);

      const [platoonRes, squadsRes] = await Promise.all([
        fetch(`${API_URL}/api/platoons/platoon/${platoonId}`),
        fetch(`${API_URL}/api/squads/platoon/${platoonId}`),
      ]);

      const platoonData = await platoonRes.json();
      const squadsData = await squadsRes.json();

      setPlatoon(platoonData);
      setSquads(squadsData);
    } catch (err) {
      console.error("Failed to load platoon data:", err);
    } finally {
      setSquadsLoaded(true);
      setLoading(false);
    }
  };

  const closeModal = () => setModalType(null);

  /* =========================
     Save personnel
  ========================= */

  const handleSave = async (data) => {
    try {
      setLoading(true);

      let endpoint = "";

      if (data.role === "sergeant") {
        endpoint = `${API_URL}/api/platoons/platoon/${platoonId}/sergeant`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save personnel");
      }

      closeModal();
      await loadAllData();
    } catch (err) {
      console.error("Save personnel error:", err);
    } finally {
      setLoading(false);
    }
  };

  const modalConfig =
    modalType === "sergeant"
      ? {
          title: t("platoonManagement.addSergeant"),
          rankOptions: MILUIM_RANKS,
          role: "sergeant",
        }
      : null;

  /* =========================
     Platoon Summary
  ========================= */

  const totalSoldiers =
    (platoon?.soldiers?.length || 0) +
    (platoon?.commanders?.length || 0) +
    (platoon?.sergeant ? 1 : 0) +
    (platoon?.commander ? 1 : 0);

  const totalSquads = squads.length;
  const totalCommanders = platoon?.commanders?.length || 0;

  if (!platoon || !squadsLoaded) {
    return null;
  }

  return (
    <>
      <div className="personnel-management-container">
        <div className="personnel-management-content">
          {/* Header */}
          <div className="personnel-management-header">
            <h1>{t("platoonManagement.title")}</h1>
          </div>

          {/* ========================
             Platoon Summary
          ======================== */}

          <div className="personnel-summary">
            <div className="summary-item">
              <span className="summary-label">
                {t("platoonManagement.totalSoldiers")}
              </span>
              <span className="summary-value">{totalSoldiers}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                {t("platoonManagement.totalSquads")}
              </span>
              <span className="summary-value">{totalSquads}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">
                {t("platoonManagement.totalCommanders")}
              </span>
              <span className="summary-value">{totalCommanders}</span>
            </div>
          </div>

          {/* Platoon Structure */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>{t("platoonManagement.platoonStructure")}</h3>
            </div>

            {/* Commander */}
            <div className="person-row">
              <strong>{t("platoonManagement.platoonCommander")}:</strong>{" "}
              {!platoon?.commander ? (
                <span className="table-placeholder">
                  {t("platoonManagement.noPlatoonCommander")}
                </span>
              ) : (
                <span className="name">
                  {t(`ranks.${platoon.commander.rank}`)}{" "}
                  {platoon.commander.first_name} {platoon.commander.last_name}
                </span>
              )}
            </div>

            {/* Sergeant */}
            <div className="person-row">
              <strong>{t("platoonManagement.sergeant")}:</strong>{" "}
              {platoon?.sergeant ? (
                <span className="name">
                  {t(`ranks.${platoon.sergeant.rank}`)}{" "}
                  {platoon.sergeant.first_name} {platoon.sergeant.last_name}
                </span>
              ) : (
                <>
                  <span className="table-placeholder">
                    {t("platoonManagement.noSergeant")}
                  </span>

                  <button
                    className="primary-button"
                    style={{ marginRight: "10px" }}
                    onClick={() => setModalType("sergeant")}
                  >
                    {t("platoonManagement.addSergeant")}
                  </button>
                </>
              )}
            </div>

            {/* Squads */}
            <div style={{ marginTop: "15px" }}>
              <strong>{t("platoonManagement.squads")}:</strong>

              {squads.length ? (
                squads.map((squad) => (
                  <div key={squad.id} className="person-row">
                    <span>
                      {t("platoonManagement.squad", { number: squad.number })}
                    </span>

                    <button className="primary-button" disabled>
                      {t("common.manage")}
                    </button>
                  </div>
                ))
              ) : (
                <div className="table-placeholder">
                  {t("platoonManagement.noSquads")}
                </div>
              )}

              {/* Create squad button */}
              <div style={{ marginTop: "15px" }}>
                <button
                  className="primary-button"
                  onClick={() => setShowCreateSquad(true)}
                >
                  {t("platoonManagement.createSquad")}
                </button>
              </div>
            </div>
          </div>

          {/* Back button */}
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <button className="secondary-button" onClick={() => navigate(-1)}>
              ← {t("common.back")}
            </button>
          </div>
        </div>
      </div>

      {/* Sergeant Modal */}
      {modalType && modalConfig && (
        <AddPersonnelModal
          title={modalConfig.title}
          rankOptions={modalConfig.rankOptions}
          role={modalConfig.role}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {/* Create Squad Modal */}
      {showCreateSquad && (
        <CreateSquadModal
          platoonId={platoonId}
          nextSquadNumber={squads.length + 1}
          onClose={() => setShowCreateSquad(false)}
          onSave={() => loadAllData()}
        />
      )}
    </>
  );
}

export default PlatoonManagement;

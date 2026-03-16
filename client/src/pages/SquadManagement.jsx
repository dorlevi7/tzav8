import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

import AddPersonnelModal from "../components/modals/AddPersonnelModal";

const SOLDIER_RANKS = ["corporal", "sergeant", "staffSergeant"];

function SquadManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { squadId } = useParams();
  const navigate = useNavigate();

  const [squad, setSquad] = useState(null);
  const [showAddSoldier, setShowAddSoldier] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  usePageTitle(t("squadManagement.title"));

  /* =========================
     Load squad data
  ========================= */

  useEffect(() => {
    loadSquad();
  }, [squadId]);

  const loadSquad = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/squads/${squadId}`);
      const data = await res.json();

      setSquad(data);
    } catch (err) {
      console.error("Failed to load squad:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Save soldier
  ========================= */

  const handleSave = async (data) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/squads/${squadId}/soldiers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to add soldier");
      }

      setShowAddSoldier(false);
      await loadSquad();
    } catch (err) {
      console.error("Save soldier error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!squad) return null;

  /* =========================
     Filter soldiers (exclude commander)
  ========================= */

  const soldiersOnly =
    squad?.soldiers?.filter((s) => s.id !== squad?.commander?.id) || [];

  /* =========================
     Squad Summary
  ========================= */

  const soldiersCount = squad?.soldiers?.length || 0;
  const commanderCount = squad?.commander ? 1 : 0;


  const totalPersonnel = soldiersCount + commanderCount;


  return (
    <>
      <div className="page-container">
        <div className="page-content">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">
              {t("squadManagement.title")} {squad.number}
            </h1>
          </div>

          {/* ========================
             Squad Summary
          ======================== */}

          <div className="card">
            <div className="personnel-summary">
              <div className="summary-item">
                <span className="summary-label">
                  {t("squadManagement.totalSoldiers")}
                </span>
                <span className="summary-value">{totalPersonnel}</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">
                  {t("squadManagement.hasCommander")}
                </span>
                <span className="summary-value">
                  {commanderCount ? "✓" : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* ========================
             Squad Structure
          ======================== */}

          <div className="card">
            <h3>{t("squadManagement.squadStructure")}</h3>

            {/* Squad Commander */}
            <div className="info-section">
              <strong>{t("squadManagement.commander")}:</strong>

              {squad.commander ? (
                <div className="name">
                  {t(`ranks.${squad.commander.rank}`)}{" "}
                  {squad.commander.first_name} {squad.commander.last_name}
                </div>
              ) : (
                <div className="table-placeholder">
                  {t("squadManagement.noCommander")}
                </div>
              )}
            </div>

            {/* Soldiers */}
            <div className="info-section">
              <strong>{t("squadManagement.soldiers")}</strong>

              <div className="items-list">
                {soldiersOnly.length ? (
                  soldiersOnly.map((s) => (
                    <div key={s.id} className="item-row-center">
                      {t(`ranks.${s.rank}`)} {s.first_name} {s.last_name}
                    </div>
                  ))
                ) : (
                  <div className="table-placeholder">
                    {t("squadManagement.noSoldiers")}
                  </div>
                )}
              </div>

              {/* Add soldier button */}
              <div className="section-action">
                <button
                  className="primary-button"
                  onClick={() => setShowAddSoldier(true)}
                >
                  {t("squadManagement.addSoldier")}
                </button>
              </div>
            </div>
          </div>

          {/* Back button */}
          <div className="page-actions">
            <button className="secondary-button" onClick={() => navigate(-1)}>
              ← {t("common.back")}
            </button>
          </div>
        </div>
      </div>

      {/* Add Soldier Modal */}
      {showAddSoldier && (
        <AddPersonnelModal
          title={t("squadManagement.addSoldier")}
          role="soldier"
          rankOptions={SOLDIER_RANKS}
          onClose={() => setShowAddSoldier(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default SquadManagement;

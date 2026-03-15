import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function SquadManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { squadId } = useParams();
  const navigate = useNavigate();

  const [squad, setSquad] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  usePageTitle(t("squadManagement.title"));

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

  if (!squad) return null;

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">
            {t("squadManagement.title")} #{squad.number}
          </h1>
        </div>

        {/* Squad info */}
        <div className="card">
          <h3>{t("squadManagement.commander")}</h3>

          {squad.commander ? (
            <div className="info-row">
              {squad.commander.rank} {squad.commander.first_name}{" "}
              {squad.commander.last_name}
            </div>
          ) : (
            <div className="table-placeholder">
              {t("squadManagement.noCommander")}
            </div>
          )}
        </div>

        {/* Soldiers */}
        <div className="card">
          <h3>{t("squadManagement.soldiers")}</h3>

          <div className="items-list">
            {squad.soldiers?.length ? (
              squad.soldiers.map((s) => (
                <div key={s.id} className="item-row">
                  {s.rank} {s.first_name} {s.last_name}
                </div>
              ))
            ) : (
              <div className="table-placeholder">
                {t("squadManagement.noSoldiers")}
              </div>
            )}
          </div>
        </div>

        <div className="page-actions">
          <button className="secondary-button" onClick={() => navigate(-1)}>
            ← {t("common.back")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SquadManagement;

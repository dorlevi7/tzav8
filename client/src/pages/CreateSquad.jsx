import "../styles/pages/PersonnelManagement.css";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

import AddPersonnelModal from "../components/modals/AddPersonnelModal";

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

function CreateSquad() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  const { platoonId } = useParams();
  const navigate = useNavigate();

  const [modalType, setModalType] = useState(null);
  const [squadNumber, setSquadNumber] = useState("");
  const [commander, setCommander] = useState(null);
  const [soldiers, setSoldiers] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  usePageTitle(t("createSquad.title"));

  const closeModal = () => setModalType(null);

  /* =========================
     Save personnel locally
  ========================= */

  const handleSavePersonnel = (data) => {
    if (data.role === "commander") {
      setCommander(data);
    }

    if (data.role === "soldier") {
      setSoldiers((prev) => [...prev, data]);
    }

    closeModal();
  };

  /* =========================
     Create squad
  ========================= */

  const createSquad = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/squads/platoon/${platoonId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: squadNumber,
            commander,
            soldiers,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create squad");
      }

      navigate(`/personnel/platoons/${platoonId}`);
    } catch (err) {
      console.error("Create squad error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Modal config
  ========================= */

  const modalConfig =
    modalType === "commander"
      ? {
          title: t("createSquad.addCommander"),
          rankOptions: MILUIM_RANKS,
          role: "commander",
        }
      : modalType === "soldier"
        ? {
            title: t("createSquad.addSoldier"),
            rankOptions: MILUIM_RANKS,
            role: "soldier",
          }
        : null;

  return (
    <>
      <div className="personnel-management-container">
        <div className="personnel-management-content">
          {/* Header */}
          <div className="personnel-management-header">
            <h1>{t("createSquad.title")}</h1>
          </div>

          {/* Squad details */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>{t("createSquad.squadDetails")}</h3>
            </div>

            <div className="form-row">
              <label>{t("createSquad.squadNumber")}</label>

              <input
                type="number"
                value={squadNumber}
                onChange={(e) => setSquadNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Commander */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>{t("createSquad.commander")}</h3>

              <button
                className="primary-button"
                onClick={() => setModalType("commander")}
              >
                {t("createSquad.addCommander")}
              </button>
            </div>

            {commander ? (
              <div className="person-row">
                <span className="rank">{t(`ranks.${commander.rank}`)}</span>

                <span className="name">
                  {commander.firstName} {commander.lastName}
                </span>
              </div>
            ) : (
              <div className="table-placeholder">
                {t("createSquad.noCommander")}
              </div>
            )}
          </div>

          {/* Soldiers */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>{t("createSquad.soldiers")}</h3>

              <button
                className="primary-button"
                onClick={() => setModalType("soldier")}
              >
                {t("createSquad.addSoldier")}
              </button>
            </div>

            {soldiers.length ? (
              soldiers.map((s, i) => (
                <div key={i} className="person-row">
                  <span className="rank">{t(`ranks.${s.rank}`)}</span>

                  <span className="name">
                    {s.firstName} {s.lastName}
                  </span>
                </div>
              ))
            ) : (
              <div className="table-placeholder">
                {t("createSquad.noSoldiers")}
              </div>
            )}
          </div>

          {/* Create button */}
          <div className="dashboard-card">
            <button className="primary-button" onClick={createSquad}>
              {t("createSquad.createSquad")}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalType && modalConfig && (
        <AddPersonnelModal
          title={modalConfig.title}
          rankOptions={modalConfig.rankOptions}
          role={modalConfig.role}
          onClose={closeModal}
          onSave={handleSavePersonnel}
        />
      )}
    </>
  );
}

export default CreateSquad;

import "../styles/pages/PersonnelManagement.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

function PlatoonManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { platoonId } = useParams();

  const [modalType, setModalType] = useState(null);

  usePageTitle(t("platoonManagement.title"));

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [setLoading]);

  const closeModal = () => setModalType(null);

  const handleSave = (data) => {
    console.log("Save personnel", data, platoonId);
    closeModal();
  };

  const getModalConfig = () => {
    switch (modalType) {
      case "sergeant":
        return {
          title: t("platoonManagement.addSergeant"),
          rankOptions: MILUIM_RANKS,
          role: "sergeant",
        };

      case "commander":
        return {
          title: t("platoonManagement.addCommander"),
          rankOptions: MILUIM_RANKS,
          role: "commander",
        };

      case "soldier":
        return {
          title: t("platoonManagement.addSoldier"),
          rankOptions: MILUIM_RANKS,
          role: "soldier",
        };

      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  return (
    <>
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
                <button
                  className="primary-button"
                  onClick={() => setModalType("sergeant")}
                >
                  {t("platoonManagement.addSergeant")}
                </button>

                <button
                  className="primary-button"
                  onClick={() => setModalType("commander")}
                >
                  {t("platoonManagement.addCommander")}
                </button>

                <button
                  className="primary-button"
                  onClick={() => setModalType("soldier")}
                >
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

      {/* Unified Modal */}
      {modalType && modalConfig && (
        <AddPersonnelModal
          title={modalConfig.title}
          rankOptions={modalConfig.rankOptions}
          role={modalConfig.role}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default PlatoonManagement;

import "../styles/pages/PersonnelManagement.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

import CreatePlatoonModal from "../components/modals/CreatePlatoonModal";

function PlatoonsManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const [platoons, setPlatoons] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  usePageTitle(t("platoonsManagement.title"));

  useEffect(() => {
    loadPlatoons();
  }, []);

  /* ========================
     LOAD PLATOONS FROM SERVER
  ======================== */

  const loadPlatoons = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;

      const response = await fetch(`${API_URL}/api/platoons/${companyId}`);

      const data = await response.json();

      setPlatoons(data);
    } catch (err) {
      console.error("Failed to load platoons:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     Calculate next platoon number
  ======================== */

  const nextPlatoonNumber = platoons.length + 1;

  return (
    <>
      <div className="personnel-management-container">
        <div className="personnel-management-content">
          <div className="personnel-management-header">
            <h1>{t("platoonsManagement.title")}</h1>
          </div>

          {/* אם אין מחלקות */}
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

          {/* אם יש מחלקות */}
          {platoons.length > 0 && (
            <div className="dashboard-grid">
              {platoons.map((platoon) => (
                <div className="dashboard-card" key={platoon.id}>
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

                    <button
                      className="secondary-button"
                      onClick={() =>
                        navigate(`/personnel/platoons/${platoon.id}/view`)
                      }
                    >
                      {t("common.view")}
                    </button>
                  </div>
                </div>
              ))}

              {/* כרטיס הוספת מחלקה */}
              <div className="dashboard-card add-card">
                <button
                  className="primary-button"
                  onClick={() => setShowCreateModal(true)}
                >
                  + {t("platoonsManagement.createPlatoon")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Platoon Modal */}
      {showCreateModal && (
        <CreatePlatoonModal
          nextPlatoonNumber={nextPlatoonNumber}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            loadPlatoons();
            setShowCreateModal(false);
          }}
        />
      )}
    </>
  );
}

export default PlatoonsManagement;

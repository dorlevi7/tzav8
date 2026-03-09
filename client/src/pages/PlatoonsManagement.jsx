import "../styles/pages/PersonnelManagement.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

import CreatePlatoonModal from "../components/modals/CreatePlatoonModal";

function PlatoonsManagement() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  const [platoons, setPlatoons] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  usePageTitle(t("platoonsManagement.title"));

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);

      /* לדוגמה: אם אין מחלקות */
      setPlatoons([]);
    }, 400);

    return () => clearTimeout(timer);
  }, [setLoading]);

  /* ========================
     Save new platoon
  ======================== */

  const handleSavePlatoon = (data) => {
    const newPlatoon = {
      id: Date.now(),
      number: data.number,
      name: data.name,
      commander: data.commander,
      sergeant: data.sergeant,
    };

    setPlatoons([...platoons, newPlatoon]);
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
                    <button className="primary-button">
                      {t("common.manage")}
                    </button>

                    <button className="secondary-button">
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
          onSave={(data) => {
            handleSavePlatoon(data);
            setShowCreateModal(false);
          }}
        />
      )}
    </>
  );
}

export default PlatoonsManagement;

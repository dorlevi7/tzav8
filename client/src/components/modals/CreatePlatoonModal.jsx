import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../ui/Modal";

import PlatoonDetailsModal from "./PlatoonDetailsModal";
import PlatoonCommanderModal from "./PlatoonCommanderModal";

function CreatePlatoonModal({ onClose, onSave, nextPlatoonNumber }) {
  const { t } = useTranslation();

  const [platoonDetails, setPlatoonDetails] = useState(null);
  const [commanderDetails, setCommanderDetails] = useState(null);

  const [showPlatoonModal, setShowPlatoonModal] = useState(false);
  const [showCommanderModal, setShowCommanderModal] = useState(false);

  const handleSubmit = () => {
    if (!platoonDetails || !commanderDetails) return;

    onSave({
      number: nextPlatoonNumber,
      name: platoonDetails.name,
      commander: commanderDetails,
    });
  };

  return (
    <>
      <Modal title={t("platoonsManagement.createPlatoon")} onClose={onClose}>
        <button
          className="primary-button"
          onClick={() => setShowPlatoonModal(true)}
        >
          {platoonDetails ? "✔ " : ""}
          {t("platoonsManagement.platoonDetails")}
        </button>

        <button
          className="primary-button"
          onClick={() => setShowCommanderModal(true)}
        >
          {commanderDetails ? "✔ " : ""}
          {t("platoonsManagement.commanderDetails")}
        </button>

        <button onClick={handleSubmit}>{t("common.save")}</button>
      </Modal>

      {showPlatoonModal && (
        <PlatoonDetailsModal
          nextPlatoonNumber={nextPlatoonNumber}
          onClose={() => setShowPlatoonModal(false)}
          onSave={(data) => {
            setPlatoonDetails(data);
            setShowPlatoonModal(false);
          }}
        />
      )}

      {showCommanderModal && (
        <PlatoonCommanderModal
          onClose={() => setShowCommanderModal(false)}
          onSave={(data) => {
            setCommanderDetails(data);
            setShowCommanderModal(false);
          }}
        />
      )}
    </>
  );
}

export default CreatePlatoonModal;

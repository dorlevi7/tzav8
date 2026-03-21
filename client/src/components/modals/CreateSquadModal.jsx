import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";

import SquadDetailsModal from "./SquadDetailsModal";
import SquadCommanderModal from "./SquadCommanderModal";

import { useLoading } from "../../context/LoadingContext";
import { errorMap } from "../../utils/errorMap";

function CreateSquadModal({ onClose, onSave, nextSquadNumber, platoonId }) {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  const API_URL = import.meta.env.VITE_API_URL;

  const [squadDetails, setSquadDetails] = useState(null);
  const [commanderDetails, setCommanderDetails] = useState(null);

  const [showSquadModal, setShowSquadModal] = useState(false);
  const [showCommanderModal, setShowCommanderModal] = useState(false);

  /* ========================
     Create squad
  ======================== */

  const handleSubmit = async () => {
    if (!squadDetails) {
      toast.error(t("platoonManagement.squadDetailsRequired"));
      return;
    }

    if (!commanderDetails) {
      toast.error(t("platoonManagement.commanderDetailsRequired"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/squads/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platoonId,

          squadName: squadDetails.name,

          username: commanderDetails.username,
          password: commanderDetails.password,

          firstName: commanderDetails.firstName,
          lastName: commanderDetails.lastName,
          rank: commanderDetails.rank,
          personalNumber: commanderDetails.personalNumber,
          email: commanderDetails.email,
          phone: commanderDetails.phone,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {}

      /* ✅ Unified error handling */
      if (!response.ok) {
        const key = errorMap[data?.error];

        toast.error(
          key
            ? t(key)
            : data?.error && !data.error.includes("Failed")
              ? data.error
              : t("auth.serverError"),
        );
        return;
      }

      /* ✅ Success */
      toast.success(t("platoonManagement.squadCreated"));

      onSave({
        number: nextSquadNumber,
        name: squadDetails.name,
      });

      onClose();
    } catch (err) {
      console.error("Create squad error:", err);
      toast.error(t("auth.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal title={t("platoonManagement.createSquad")} onClose={onClose}>
        <button
          className="primary-button"
          onClick={() => setShowSquadModal(true)}
        >
          {squadDetails ? "✔ " : ""}
          {t("createSquad.squadDetails")}
        </button>

        <button
          className="primary-button"
          onClick={() => setShowCommanderModal(true)}
        >
          {commanderDetails ? "✔ " : ""}
          {t("createSquad.commanderDetails")}
        </button>

        <button className="primary-button" onClick={handleSubmit}>
          {t("common.save")}
        </button>
      </Modal>

      {showSquadModal && (
        <SquadDetailsModal
          nextSquadNumber={nextSquadNumber}
          onClose={() => setShowSquadModal(false)}
          onSave={(data) => {
            setSquadDetails(data);
            setShowSquadModal(false);
          }}
        />
      )}

      {showCommanderModal && (
        <SquadCommanderModal
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

export default CreateSquadModal;

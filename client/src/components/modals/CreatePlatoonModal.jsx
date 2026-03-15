import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";

import PlatoonDetailsModal from "./PlatoonDetailsModal";
import PlatoonCommanderModal from "./PlatoonCommanderModal";

import { useLoading } from "../../context/LoadingContext";

function CreatePlatoonModal({ onClose, onSave, nextPlatoonNumber }) {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  const API_URL = import.meta.env.VITE_API_URL;

  const [platoonDetails, setPlatoonDetails] = useState(null);
  const [commanderDetails, setCommanderDetails] = useState(null);

  const [showPlatoonModal, setShowPlatoonModal] = useState(false);
  const [showCommanderModal, setShowCommanderModal] = useState(false);

  /* ========================
     Create platoon
  ======================== */

  const handleSubmit = async () => {
    if (!platoonDetails) {
      toast.error(t("platoonsManagement.platoonDetailsRequired"));
      return;
    }

    if (!commanderDetails) {
      toast.error(t("platoonsManagement.commanderDetailsRequired"));
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.companyId) {
      toast.error(t("auth.companyNotFound"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/platoons/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: user.companyId,

          platoonName: platoonDetails.name,

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

      const data = await response.json();

      const errorMap = {
        "Username already exists": "auth.usernameExists",
        "Email already exists": "auth.emailExists",
        "Personal number already exists": "auth.personalNumberExists",
      };

      if (!response.ok) {
        const errorMessage = data?.error;

        const key = errorMap[errorMessage];

        toast.error(key ? t(key) : t("auth.serverError"));

        return;
      }

      toast.success(t("platoonsManagement.platoonCreated"));

      onSave({
        number: nextPlatoonNumber,
        name: platoonDetails.name,
        commander: commanderDetails,
      });

      onClose();
    } catch (err) {
      console.error("Create platoon error:", err);
      toast.error(t("auth.serverError"));
    } finally {
      setLoading(false);
    }
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

        <button className="primary-button" onClick={handleSubmit}>
          {t("common.save")}
        </button>
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

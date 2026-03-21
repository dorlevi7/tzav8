import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";

function SquadDetailsModal({ onClose, onSave, nextSquadNumber }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    /* ✅ Validation */
    if (!form.name) {
      toast.error(t("platoonManagement.squadDetailsRequired"));
      return;
    }

    /* ✅ Submit */
    onSave({
      ...form,
      number: nextSquadNumber,
    });
  };

  return (
    <Modal title={t("platoonManagement.squadDetails")} onClose={onClose}>
      {/* Squad number (auto) */}
      <input
        value={t("platoonManagement.squad", { number: nextSquadNumber })}
        disabled
      />

      {/* Squad name */}
      <input
        name="name"
        placeholder={t("platoonManagement.squadName")}
        value={form.name}
        onChange={handleChange}
      />

      {/* Save button */}
      <button onClick={handleSubmit}>{t("common.save")}</button>
    </Modal>
  );
}

export default SquadDetailsModal;

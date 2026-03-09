import { useState } from "react";
import { useTranslation } from "react-i18next";
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
    onSave({
      ...form,
      number: nextSquadNumber,
    });
  };

  return (
    <Modal title={t("platoonManagement.squadDetails")} onClose={onClose}>
      <input
        value={t("platoonManagement.squad", { number: nextSquadNumber })}
        disabled
      />

      <input
        name="name"
        placeholder={t("platoonManagement.squadName")}
        value={form.name}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>{t("common.save")}</button>
    </Modal>
  );
}

export default SquadDetailsModal;

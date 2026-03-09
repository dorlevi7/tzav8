import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../ui/Modal";

function PlatoonDetailsModal({ onClose, onSave, nextPlatoonNumber }) {
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
      number: nextPlatoonNumber,
    });
  };

  return (
    <Modal title={t("platoonsManagement.platoonDetails")} onClose={onClose}>
      <input
        value={t("platoonsManagement.platoon", { number: nextPlatoonNumber })}
        disabled
      />

      <input
        name="name"
        placeholder={t("platoonsManagement.platoonName")}
        value={form.name}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>{t("common.save")}</button>
    </Modal>
  );
}

export default PlatoonDetailsModal;

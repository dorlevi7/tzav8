import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../ui/Modal";
import Dropdown from "../ui/Dropdown";

const OFFICER_RANKS = [
  "secondLieutenant",
  "firstLieutenant",
  "captain",
  "major",
  "lieutenantColonel",
  "colonel",
];

function PlatoonCommanderModal({ onClose, onSave }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    rank: "",
    personalNumber: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRankChange = (rank) => {
    setForm({
      ...form,
      rank,
    });
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.rank) return;

    onSave(form);
  };

  return (
    <Modal title={t("platoonsManagement.commanderDetails")} onClose={onClose}>
      <input
        name="firstName"
        placeholder={t("auth.firstName")}
        value={form.firstName}
        onChange={handleChange}
      />

      <input
        name="lastName"
        placeholder={t("auth.lastName")}
        value={form.lastName}
        onChange={handleChange}
      />

      <Dropdown
        options={OFFICER_RANKS}
        value={form.rank}
        placeholder={t("auth.rank")}
        onChange={handleRankChange}
        renderOption={(rank) => t(`ranks.${rank}`)}
      />

      <input
        name="personalNumber"
        placeholder={t("auth.personalNumber")}
        value={form.personalNumber}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder={t("auth.email")}
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder={t("auth.phone")}
        value={form.phone}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>{t("common.save")}</button>
    </Modal>
  );
}

export default PlatoonCommanderModal;

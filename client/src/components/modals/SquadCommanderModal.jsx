import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Dropdown from "../ui/Dropdown";

import { NON_OFFICER_RANKS } from "../../constants/ranks";

function SquadCommanderModal({ onClose, onSave }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    username: "",
    password: "",
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
    /* ✅ Validation */
    if (
      !form.username ||
      !form.password ||
      !form.firstName ||
      !form.lastName ||
      !form.rank
    ) {
      toast.error(t("platoonManagement.commanderDetailsRequired"));
      return;
    }

    /* ✅ Submit */
    onSave(form);
  };

  return (
    <Modal title={t("platoonManagement.commanderDetails")} onClose={onClose}>
      <input
        name="username"
        placeholder={t("auth.username")}
        value={form.username}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder={t("auth.password")}
        value={form.password}
        onChange={handleChange}
      />

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
        options={NON_OFFICER_RANKS}
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

export default SquadCommanderModal;

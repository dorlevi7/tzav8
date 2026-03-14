import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../ui/Modal";

function AddSoldierModal({ onClose, onSave }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
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

  const handleSubmit = () => {
    if (
      !form.username ||
      !form.password ||
      !form.firstName ||
      !form.lastName ||
      !form.personalNumber
    ) {
      return;
    }

    onSave(form);
  };

  return (
    <Modal title={t("platoonManagement.addSoldier")} onClose={onClose}>
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

export default AddSoldierModal;

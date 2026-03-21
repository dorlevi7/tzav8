import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";

function CompanyDetailsModal({ onClose, onSave }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    companyName: "",
    battalionName: "",
    battalionNumber: "",
    companyPhone: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    /* ✅ Validation */
    if (!form.companyName || !form.battalionName || !form.battalionNumber) {
      toast.error(t("auth.companyDetailsRequired"));
      return;
    }

    /* ✅ Submit */
    onSave(form);
  };

  return (
    <Modal title={t("auth.companyDetails")} onClose={onClose}>
      <input
        name="companyName"
        placeholder={t("auth.companyName")}
        value={form.companyName}
        onChange={handleChange}
      />

      <input
        name="battalionName"
        placeholder={t("auth.battalionName")}
        value={form.battalionName}
        onChange={handleChange}
      />

      <input
        name="battalionNumber"
        placeholder={t("auth.battalionNumber")}
        value={form.battalionNumber}
        onChange={handleChange}
      />

      <input
        name="companyPhone"
        placeholder={t("auth.companyPhone")}
        value={form.companyPhone}
        onChange={handleChange}
      />

      <button type="button" onClick={handleSubmit}>
        {t("common.save")}
      </button>
    </Modal>
  );
}

export default CompanyDetailsModal;

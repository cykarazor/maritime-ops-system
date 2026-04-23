import { useState, useEffect, useCallback, useRef } from "react";
import { validate as coreValidate } from "../validators/coreValidator";

export const useFormEngine = ({
  initialState,
  initialData,
  mapToForm,
  mapToPayload,
  onSubmit,
  validate,
  rules,
  asyncValidate,
  storageKey,
  autoSave = true,
  fieldConfig = {},
}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEdit = !!initialData;
  const isInactive = initialData?.isDeleted;

  const hydratedRef = useRef(false);

  // =========================
  // RESET HYDRATION WHEN RECORD CHANGES
  // =========================
  useEffect(() => {
    hydratedRef.current = false;
  }, [initialData]);

  // =========================
  // LOAD FROM LOCAL STORAGE
  // =========================
  useEffect(() => {
    if (!storageKey) return;

    const saved = localStorage.getItem(storageKey);
    if (saved && !initialData) {
      setFormData(JSON.parse(saved));
      setIsDirty(true);
    }
  }, [storageKey, initialData]);

  // =========================
  // HYDRATION (EDIT MODE SAFE)
  // =========================
  useEffect(() => {
    if (initialData && !hydratedRef.current) {
      const mapped = mapToForm ? mapToForm(initialData) : initialData;
      setFormData(mapped || initialState);
      hydratedRef.current = true;
    }

    if (!initialData) {
      hydratedRef.current = false;
    }
  }, [initialData, mapToForm, initialState]);

  // =========================
  // AUTO SAVE
  // =========================
  useEffect(() => {
    if (!autoSave || !storageKey || !isDirty) return;

    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(formData));
      setIsSaving(false);
    }, 800);

    setIsSaving(true);

    return () => clearTimeout(timer);
  }, [formData, autoSave, storageKey, isDirty]);

  // =========================
  // VALIDATION (FIXED)
  // =========================
  const runValidation = useCallback(() => {
    let result = {};

    if (rules) {
      result = coreValidate(formData, rules) || {};
    } else if (validate) {
      result = validate(formData) || {};
    }

    setErrors(result);

    const hasErrors = Object.keys(result).length > 0;

    //console.log("VALIDATION RESULT:", result);

    return !hasErrors;
  }, [formData, rules, validate]);

  // =========================
  // ASYNC VALIDATION
  // =========================
  const runAsyncValidation = useCallback(
    async (field, value) => {
      if (!asyncValidate) return;

      const error = await asyncValidate(field, value, formData);

      setErrors((prev) => ({
        ...prev,
        [field]: error || "",
      }));
    },
    [asyncValidate, formData]
  );

  // =========================
  // CHANGE HANDLER
  // =========================
  const handleChange = useCallback((e) => {
  const { name, value } = e.target;

  const config = fieldConfig?.[name];

  let parsedValue = value;

  // 🧠 NUMERIC HANDLING
  if (config?.type === "number") {
    if (value === "") {
      parsedValue = null;
    } else {
      const num = Number(value);
      parsedValue = Number.isNaN(num) ? null : num;
    }
  }

  setFormData((prev) => ({
    ...prev,
    [name]: parsedValue,
  }));

  setIsDirty(true);
}, [fieldConfig]);

  // =========================
  // BLUR HANDLER
  // =========================
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      if (rules || validate) {
        runValidation();
      }

      if (asyncValidate) {
        runAsyncValidation(name, value);
      }
    },
    [rules, validate, runValidation, asyncValidate, runAsyncValidation]
  );

  // =========================
  // SET FIELD
  // =========================
  const setField = useCallback((name, value) => {
  const config = fieldConfig?.[name];

  let parsedValue = value;

  if (config?.type === "number") {
    if (value === "") {
      parsedValue = null;
    } else {
      const num = Number(value);
      parsedValue = Number.isNaN(num) ? null : num;
    }
  }

  setFormData((prev) => ({
    ...prev,
    [name]: parsedValue,
  }));

  setIsDirty(true);
}, [fieldConfig]);

  // =========================
  // RESET FORM
  // =========================
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
    setIsDirty(false);

    if (storageKey) {
      localStorage.removeItem(storageKey);
    }

    hydratedRef.current = false;
  }, [initialState, storageKey]);

  // =========================
  // SUBMIT (FIXED + CLEAN)
  // =========================
  const handleSubmit = useCallback(
    (e) => {
      if (e?.preventDefault) e.preventDefault();

      if (typeof onSubmit !== "function") {
        console.error("❌ onSubmit is not a function:", onSubmit);
        return;
      }

      const isValid = runValidation();

      if (!isValid) {
        //console.log("❌ FORM BLOCKED - validation failed");
        return;
      }

      if (isEdit && !isDirty) return;

      const rawPayload = mapToPayload
        ? mapToPayload(formData)
        : formData;

      onSubmit(rawPayload || formData);

      if (!isEdit) {
        resetForm();
      }
    },
    [
      formData,
      mapToPayload,
      onSubmit,
      isEdit,
      isDirty,
      runValidation,
      resetForm,
    ]
  );

  return {
    formData,
    setFormData,

    handleChange,
    handleBlur,
    handleSubmit,

    setField,
    resetForm,

    errors,
    touched,
    isDirty,
    isSaving,

    isEdit,
    isInactive,
  };
};
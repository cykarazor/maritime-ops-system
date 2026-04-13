import { useState, useEffect, useCallback, useRef } from "react";

export const useFormEngine = ({
  initialState,
  initialData,
  mapToForm,
  mapToPayload,
  onSubmit,
  validate,
  asyncValidate, // 🔥 NEW (optional)
  storageKey,    // 🔥 NEW (for auto-save)
  autoSave = true,
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
  // LOAD FROM STORAGE (RESTORE DRAFT)
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
      setFormData(mapped);
      hydratedRef.current = true;
    }

    if (!initialData) {
      hydratedRef.current = false;
    }
  }, [initialData, mapToForm]);

  // =========================
  // AUTO SAVE (DEBOUNCED)
  // =========================
  useEffect(() => {
    if (!autoSave || !storageKey) return;

    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(formData));
      setIsSaving(false);
    }, 800);

    setIsSaving(true);

    return () => clearTimeout(timer);
  }, [formData, autoSave, storageKey]);

  // =========================
  // VALIDATION RUNNER
  // =========================
  const runValidation = useCallback(() => {
    if (!validate) return true;

    const result = validate(formData);
    setErrors(result || {});

    return !result || Object.keys(result).length === 0;
  }, [formData, validate]);

  // =========================
  // ASYNC VALIDATION (OPTIONAL)
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);
  }, []);

  // =========================
  // BLUR HANDLER (NEW)
  // =========================
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // run sync validation
      if (validate) {
        const result = validate({
          ...formData,
          [name]: value,
        });

        setErrors(result || {});
      }

      // run async validation
      if (asyncValidate) {
        runAsyncValidation(name, value);
      }
    },
    [formData, validate, asyncValidate, runAsyncValidation]
  );

  // =========================
  // SET FIELD (custom logic)
  // =========================
  const setField = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);
  }, []);

  // =========================
  // RESET
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
  // SUBMIT (SAFE)
  // =========================
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const isValid = runValidation();
      if (!isValid) return;

      if (isEdit && !isDirty) return;

      const payload = mapToPayload
        ? mapToPayload(formData)
        : formData;

      onSubmit(payload);

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
    handleBlur,     // 🔥 NEW
    handleSubmit,

    setField,
    resetForm,

    errors,
    touched,        // 🔥 NEW
    isDirty,
    isSaving,       // 🔥 NEW

    isEdit,
    isInactive,
  };
};
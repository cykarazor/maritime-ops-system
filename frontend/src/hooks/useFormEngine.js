import { useEffect, useState, useCallback, useRef } from "react";

const mapInitialData = (data, initialState) => {
  return Object.keys(initialState).reduce((acc, key) => {
    let value =
      data?.[key]?._id ??
      data?.[key] ??
      initialState[key];

    acc[key] = value ?? "";
    return acc;
  }, {});
};

export const useFormEngine = ({
  initialState,
  initialData,
  onSubmit,
  transformSubmit,
}) => {
  const [formData, setFormData] = useState(initialState);

  const isEdit = !!initialData;

  // 🔥 FIX: stabilize reference
  const initialStateRef = useRef(initialState);

  useEffect(() => {
    initialStateRef.current = initialState;
  }, [initialState]);

  // =========================
  // HYDRATION (SAFE)
  // =========================
  useEffect(() => {
    if (!initialData) return;

    const hydrated = mapInitialData(
      initialData,
      initialStateRef.current
    );

    setFormData(hydrated);
  }, [initialData]);

  // =========================
  // CHANGE HANDLER
  // =========================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  }, []);

  // =========================
  // SUBMIT HANDLER
  // =========================
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      let payload = { ...formData };

      if (transformSubmit) {
        payload = transformSubmit(payload);
      }

      onSubmit(payload);

      if (!isEdit) {
        setFormData(initialStateRef.current);
      }
    },
    [formData, onSubmit, transformSubmit, isEdit]
  );

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isEdit,
  };
};
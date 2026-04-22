export const validate = (data, rules) => {
  const errors = {};

  if (Array.isArray(rules)) {
    // OLD FORMAT
    rules.forEach((rule) => {
      const value = data[rule.field];

      rule.validators.forEach((v) => {
        const error = v(value, data);
        if (error) {
          errors[rule.field] = error;
        }
      });
    });
  } else if (typeof rules === "object") {
    // NEW FORMAT (recommended)
    Object.entries(rules).forEach(([field, validators]) => {
      const value = data[field];

      for (const validator of validators) {
        const error = validator(value, data);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    });
  }

  return errors;
};
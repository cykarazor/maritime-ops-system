// validators/coreValidator.js

export const validate = (data, rules) => {
  const errors = {};

  Object.entries(rules).forEach(([field, validators]) => {
    for (const rule of validators) {
      const error = rule(data[field], data);

      if (error) {
        errors[field] = error;
        break; // stop at first error per field
      }
    }
  });

  return errors;
};
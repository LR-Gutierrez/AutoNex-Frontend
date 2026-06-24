import type { MaskitoOptions } from '@maskito/core';

export const rifMask: MaskitoOptions = {
  mask: ({ value }) => value.split('').map(() => /./),
  preprocessors: [
    ({ elementState, data }) => ({
      elementState,
      data: data.toUpperCase().replace(/[^JVEjvePGpg\d-]/g, ''),
    }),
  ],
  postprocessors: [
    ({ value, selection }) => {
      const cleaned = value.replace(/[^JVE PG\d-]/g, '');
      let newValue = cleaned;
      const diff = newValue.length - value.length;
      return { value: newValue, selection: [selection[0] + diff, selection[1] + diff] as [number, number] };
    },
  ],
};

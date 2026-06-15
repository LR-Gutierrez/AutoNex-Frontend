import type { MaskitoOptions } from '@maskito/core';

export const kmMask: MaskitoOptions = {
  mask: ({ value }) => value.split('').map(() => /./),
  preprocessors: [
    ({ elementState, data }) => ({
      elementState,
      data: data.replace(/\D/g, ''),
    }),
  ],
  postprocessors: [
    ({ value, selection }) => {
      const digits = value.replace(/\D/g, '');
      const newValue = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const diff = newValue.length - value.length;
      return { value: newValue, selection: [selection[0] + diff, selection[1] + diff] as [number, number] };
    },
  ],
};

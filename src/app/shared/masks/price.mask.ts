import type { MaskitoOptions } from '@maskito/core';

export const priceMask: MaskitoOptions = {
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
      let intPart: string;
      let decPart: string;
      if (digits.length <= 2) {
        intPart = '0';
        decPart = digits.padStart(2, '0');
      } else {
        intPart = digits.slice(0, -2).replace(/^0+/, '') || '0';
        decPart = digits.slice(-2);
      }
      const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const newValue = formattedInt + ',' + decPart;
      const diff = newValue.length - value.length;
      return { value: newValue, selection: [selection[0] + diff, selection[1] + diff] };
    },
  ],
};

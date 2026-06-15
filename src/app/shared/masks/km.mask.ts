import type { MaskitoOptions } from '@maskito/core';

export const kmMask: MaskitoOptions = {
  mask: ({ value }) => {
    const digits = value.replace(/,/g, '');
    const result: Array<RegExp | string> = [];
    for (let i = 0; i < digits.length; i++) {
      const fromRight = digits.length - i;
      if (i > 0 && fromRight % 3 === 0) result.push(',');
      result.push(/\d/);
    }
    return result;
  },
  preprocessors: [
    ({ elementState, data }) => ({
      elementState,
      data: data.replace(/\D/g, ''),
    }),
  ],
};

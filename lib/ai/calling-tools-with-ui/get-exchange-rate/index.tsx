import { FC } from 'react';
import { z } from 'zod';
import { CallingToolProps } from '@/types';
import currencies from './currencies';

interface OpenExchangeRatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: { [index: string]: number };
}

const callingToolName = 'getExchangeRate';

const toolFn = {
  [callingToolName]: {
    description:
      'To calculate the exchange rate between two currencies, first convert the currency names to their abbreviated formats, e.g., US Dollar → USD.',
    parameters: z.object({
      value: z.number(),
      currencyAbbr1: z.string(),
      currencyAbbr2: z.string(),
    }),
    execute: async ({
      value,
      currencyAbbr1,
      currencyAbbr2,
    }: {
      value: number;
      currencyAbbr1: keyof typeof currencies;
      currencyAbbr2: keyof typeof currencies;
    }) => {
      try {
        const response = await fetch(
          `https://openexchangerates.org/api/latest.json?app_id=${process.env.EXCHANGE_RATE_API_KEY}`,
        );
        const data: OpenExchangeRatesResponse = await response.json();
        const { countryEmoji: countryEmoji1, currencyName: currencyName1 } =
          currencies[currencyAbbr1];
        const { countryEmoji: countryEmoji2, currencyName: currencyName2 } =
          currencies[currencyAbbr2];

        return `${value} ${countryEmoji1} ${currencyName1} can be exchanged for ${(data.rates[currencyAbbr2] / data.rates[currencyAbbr1]) * value} ${countryEmoji2} ${currencyName2} `;
      } catch {
        return '';
      }
    },
  },
};

const Render: FC<CallingToolProps> = ({ toolInvocation }) => {
  return (
    <>{'result' in toolInvocation ? <p> {toolInvocation.result}</p> : null}</>
  );
};

const callingTool = {
  callingToolName,
  toolFn,
  Render,
};

export default callingTool;

import { FC } from 'react';
import { z } from 'zod';
import { CallingToolProps } from '@/types';
import './index.css';

const callingToolName = 'getWeather';

const toolFn = {
  [callingToolName]: {
    description: 'Display the weather in a given location to the user.',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }: { location: string }) => {
      try {
        const response = await fetch(`https://wttr.in/${location}`);
        const htmlString = await response.text();
        return htmlString.match(/<pre>(.*?)<\/pre>/s)?.[0];
      } catch {
        return '';
      }
    },
  },
};

const Render: FC<CallingToolProps> = ({ toolInvocation }) => {
  return (
    <>
      {'result' in toolInvocation ? (
        <div
          className="my-4 text-xs"
          key={toolInvocation.toolCallId}
          dangerouslySetInnerHTML={{ __html: toolInvocation.result }}
        />
      ) : null}
    </>
  );
};

const callingTool = {
  callingToolName,
  toolFn,
  Render,
};

export default callingTool;

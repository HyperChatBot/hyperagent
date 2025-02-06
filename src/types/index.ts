import { ToolInvocation } from 'ai'

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system'
}

export interface CallingToolProps {
  toolInvocation: ToolInvocation
}

export interface OnImapFlowExists {
  path: string
  count: number
  prevCount: number
}

'use client'

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Hammer,
  Mail,
  Settings2
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { useSession } from 'next-auth/react'

// This is sample data.
const data = {
  user: {
    name: 'Yancey Leo',
    email: 'yanceyofficial@gmail.com',
    avatar: 'https://avatars.githubusercontent.com/u/30535332?v=4'
  },
  teams: [
    {
      name: 'Yancey Inc.',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Apple Inc.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Microsoft Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],
  navMain: [
    {
      title: 'Available Calling Tools',
      url: '#',
      icon: Hammer,
      isActive: true,
      items: [
        {
          title: 'GetDate',
          url: '#'
        },
        {
          title: 'GetExchangeRate',
          url: '#'
        },
        {
          title: 'GetInformationFromKnowledgeBase',
          url: '#'
        },
        {
          title: 'GetWeather',
          url: '#'
        }
      ]
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Chat Bot',
          url: '#'
        },
        {
          title: 'Calling Tools',
          url: '#'
        },
        {
          title: 'RAG',
          url: '#'
        },
        {
          title: 'AI Agent',
          url: '#'
        },
        {
          title: 'AI Orchestration',
          url: '#'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Chat Bot',
      url: '/',
      icon: Bot
    },
    {
      name: 'AI Mail',
      url: '/ai-mail',
      icon: Mail
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession()
    
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

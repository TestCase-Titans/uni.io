'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  capacity: number
  registered: number
  organizer: string
  image?: string
  status: 'upcoming' | 'ongoing' | 'completed'
}

export interface Registration {
  eventId: string
  userId: string
  registeredAt: string
}

interface DataContextType {
  events: Event[]
  registrations: Registration[]
  userEvents: Event[]
  registerForEvent: (eventId: string) => void
  unregisterFromEvent: (eventId: string) => void
  createEvent: (event: Omit<Event, 'id' | 'registered'>) => void
  updateEvent: (eventId: string, updates: Partial<Event>) => void
  deleteEvent: (eventId: string) => void
  isRegistered: (eventId: string) => boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join us for an exciting day of technology presentations, workshops, and networking opportunities. Learn about the latest trends in AI, blockchain, and web development.',
    date: '2024-03-15',
    time: '09:00',
    location: 'Main Auditorium, Engineering Building',
    category: 'Technology',
    capacity: 200,
    registered: 156,
    organizer: 'Computer Science Club',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Sustainable Future Workshop',
    description: 'Explore sustainable practices and environmental solutions through hands-on workshops and expert presentations.',
    date: '2024-03-20',
    time: '14:00',
    location: 'Green Campus Center',
    category: 'Environment',
    capacity: 80,
    registered: 45,
    organizer: 'Environmental Club',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Career Fair 2024',
    description: 'Meet with top employers, explore career opportunities, and network with industry professionals.',
    date: '2024-03-25',
    time: '10:00',
    location: 'Student Union Hall',
    category: 'Career',
    capacity: 500,
    registered: 387,
    organizer: 'Career Services',
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Art & Design Showcase',
    description: 'Celebrate creativity with student artwork, design projects, and interactive installations.',
    date: '2024-02-28',
    time: '18:00',
    location: 'Art Gallery, Creative Arts Building',
    category: 'Arts',
    capacity: 120,
    registered: 98,
    organizer: 'Art Club',
    status: 'completed'
  }
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [registrations, setRegistrations] = useState<Registration[]>([])

  const registerForEvent = (eventId: string) => {
    const user = JSON.parse(localStorage.getItem('Uni.io-user') || '{}')
    if (!user.id) return

    const newRegistration: Registration = {
      eventId,
      userId: user.id,
      registeredAt: new Date().toISOString()
    }

    setRegistrations(prev => [...prev, newRegistration])
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, registered: event.registered + 1 }
        : event
    ))
  }

  const unregisterFromEvent = (eventId: string) => {
    const user = JSON.parse(localStorage.getItem('Uni.io-user') || '{}')
    if (!user.id) return

    setRegistrations(prev => prev.filter(reg => 
      !(reg.eventId === eventId && reg.userId === user.id)
    ))
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, registered: Math.max(0, event.registered - 1) }
        : event
    ))
  }

  const createEvent = (eventData: Omit<Event, 'id' | 'registered'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      registered: 0
    }
    setEvents(prev => [...prev, newEvent])
  }

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ))
  }

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId))
    setRegistrations(prev => prev.filter(reg => reg.eventId !== eventId))
  }

  const isRegistered = (eventId: string) => {
    const user = JSON.parse(localStorage.getItem('Uni.io-user') || '{}')
    if (!user.id) return false
    
    return registrations.some(reg => 
      reg.eventId === eventId && reg.userId === user.id
    )
  }

  const userEvents = events.filter(event => 
    registrations.some(reg => {
      const user = JSON.parse(localStorage.getItem('Uni.io-user') || '{}')
      return reg.eventId === event.id && reg.userId === user.id
    })
  )

  return (
    <DataContext.Provider value={{
      events,
      registrations,
      userEvents,
      registerForEvent,
      unregisterFromEvent,
      createEvent,
      updateEvent,
      deleteEvent,
      isRegistered
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
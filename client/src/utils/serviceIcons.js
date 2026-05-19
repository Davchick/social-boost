import { Target, Video, Users } from 'lucide-react'

export const serviceIconMap = {
  Target,
  Video,
  Users,
}

export function getServiceIcon(iconName) {
  return serviceIconMap[iconName] ?? Users
}

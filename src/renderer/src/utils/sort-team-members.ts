function compareByName(a: TeamMember, b: TeamMember): number {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

function compareByStatus(a: TeamMember, b: TeamMember): number {
  if (a.status === 'online' && b.status === 'offline') return -1
  if (a.status === 'offline' && b.status === 'online') return 1
  return 0
}

function compareByActivityStatus(a: TeamMember, b: TeamMember): number {
  const activityStatusOrder = { 'in tracking': 1, out: 2 }
  return activityStatusOrder[a.activity_status] - activityStatusOrder[b.activity_status]
}

export function sortTeamMembers(members: TeamMember[]): TeamMember[] {
  members.sort(compareByName)
  members.sort(compareByActivityStatus)
  members.sort(compareByStatus)

  return members
}

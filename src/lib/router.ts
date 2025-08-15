export function validateSearchChallengeType(search: Record<string, unknown>) {
  return (search['challengeType'] as string | undefined)?.toLowerCase?.() === 'team'
    ? ('team' as const)
    : ('individual' as const)
}

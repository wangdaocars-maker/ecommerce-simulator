export type CreateFlowAction = 'skip' | 'session' | 'category' | 'redirect'

export function resolveCreateFlow(
  isEditMode: boolean,
  hasSession: boolean,
  hasCategoryId: boolean
): CreateFlowAction {
  if (isEditMode) return 'skip'
  if (hasSession) return 'session'
  if (hasCategoryId) return 'category'
  return 'redirect'
}

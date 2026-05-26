import Resolver from '@forge/resolver'
import api, { route } from '@forge/api'
import { storeTenantData } from '../aws/remote-storage'

const resolver = new Resolver()

async function issueSummary(issueKey: string): Promise<string> {
  console.log(`Getting content for issue ${issueKey} ...`)
  const response = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueKey}?fields=summary`, {
      headers: {
        Accept: 'application/json',
      },
    })
  console.log(`Jira response: ${response.status} ${response.statusText}`)
  const body = await response.json()
  const content = body.fields.summary as string
  console.log(`Content: ${content}`)
  return content
}

resolver.define('sendToAws', async ({ context }) => {
  const cloudId = context.cloudId as string | undefined
  const issueKey = context.extension?.issue?.key as string | undefined

  if (!cloudId || !issueKey) {
    return { success: false, error: 'Missing context (cloudId or issueKey)' }
  }

  try {
    console.log(`Context cloudId: ${cloudId}`)
    console.log(`Jira context issueKey: ${issueKey}`)
    const content = await issueSummary(issueKey)
    await storeTenantData(cloudId, content)
    return { success: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error(`sendToAws failed: ${message}`)
    return { success: false, error: message }
  }
})

export const panelResolver = resolver.getDefinitions()

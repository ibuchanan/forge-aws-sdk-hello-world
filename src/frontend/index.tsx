import React, { useState } from 'react'
import ForgeReconciler, {
  Button,
  SectionMessage,
  Spinner,
  Text,
} from '@forge/react'
import { invoke } from '@forge/bridge'

interface SendToAwsResult {
  success: boolean
  error?: string
}

const App = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SendToAwsResult | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await invoke<SendToAwsResult>('sendToAws')
      setResult(res)
    } catch (e) {
      setResult({ success: false, error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button appearance="primary" onClick={handleClick} isDisabled={loading}>
        {loading ? 'Sending...' : 'Send to AWS'}
      </Button>
      {loading && <Spinner />}
      {result?.success && (
        <SectionMessage appearance="success">
          <Text>Successfully sent to AWS.</Text>
        </SectionMessage>
      )}
      {result && !result.success && (
        <SectionMessage appearance="error">
          <Text>Failed to send to AWS: {result.error ?? 'Unknown error'}</Text>
        </SectionMessage>
      )}
    </>
  )
}

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

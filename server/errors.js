import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const MAX_ENTRIES = 100

export function createErrorLog(errorsPath) {
  function defaultData() {
    return { version: 1, entries: [] }
  }

  function read() {
    if (!existsSync(errorsPath)) return defaultData()
    try {
      const data = JSON.parse(readFileSync(errorsPath, 'utf8'))
      if (!Array.isArray(data.entries)) return defaultData()
      return data
    } catch {
      return defaultData()
    }
  }

  function write(data) {
    writeFileSync(errorsPath, JSON.stringify(data, null, 2))
  }

  function logError({ message, path, status = 500, stack }) {
    const data = read()
    data.entries.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      message: String(message || 'Unknown error').slice(0, 500),
      path: String(path || '').slice(0, 200),
      status: Number(status) || 500,
      stack: stack ? String(stack).slice(0, 1500) : undefined,
    })
    data.entries = data.entries.slice(0, MAX_ENTRIES)
    write(data)
  }

  function listErrors(limit = 50) {
    const data = read()
    return data.entries.slice(0, Math.min(limit, MAX_ENTRIES))
  }

  return { logError, listErrors }
}

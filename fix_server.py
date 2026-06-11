with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The Linux version returns payloads at top level without a "status" field
# Replace the status check to work with both formats
old = """        if (data.status !== 'ok') {
          resolve({
            success: false,
            error: `Agent 返回异常状态: ${data.status}`,
            sessionId: sid,
          })
          return
        }"""

new = """        // Linux版OpenClaw直接返回payloads没有status字段，Windows版有status='ok'
        if (data.status && data.status !== 'ok') {
          resolve({
            success: false,
            error: `Agent 返回异常状态: ${data.status}`,
            sessionId: sid,
          })
          return
        }"""

content = content.replace(old, new)

# Also fix the payload extraction for Linux format
old2 = """        const payloads = data.result?.payloads || []"""
new2 = """        // Linux版OpenClaw: payloads在顶层; Windows版: 在data.result.payloads
        const payloads = data.payloads || data.result?.payloads || []"""

content = content.replace(old2, new2)

old3 = """        const agentMeta = data.result?.meta?.agentMeta || {}"""
new3 = """        const agentMeta = data.meta?.agentMeta || data.result?.meta?.agentMeta || {}"""

content = content.replace(old3, new3)

old4 = """        const fullReply = data.result?.finalAssistantVisibleText || replyText"""
new4 = """        const fullReply = data.meta?.finalAssistantVisibleText || data.result?.finalAssistantVisibleText || replyText"""

content = content.replace(old4, new4)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')

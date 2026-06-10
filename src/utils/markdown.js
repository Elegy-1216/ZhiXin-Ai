/**
 * 简易 Markdown → HTML 渲染器
 * 用于聊天消息气泡内的富文本展示
 */

/**
 * 将 Markdown 文本渲染为 HTML 字符串
 * @param {string} text - 原始 Markdown 文本
 * @returns {string} HTML 字符串
 */
export function renderMarkdown(text) {
  if (!text) return ''

  return text
    // 转义 HTML 实体
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 标题
    .replace(/^### (.+)$/gm, '<strong style="font-size:14px;">$1</strong>')
    .replace(/^## (.+)$/gm, '<strong style="font-size:15px;">$1</strong>')
    .replace(/^# (.+)$/gm, '<strong style="font-size:16px;">$1</strong>')
    // 粗体 / 斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 分隔线
    .replace(/^---$/gm, '<hr>')
    // 换行
    .replace(/\n/g, '<br>')
}

export default renderMarkdown

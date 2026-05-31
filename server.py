#!/usr/bin/env python3
"""
知因AI · API 代理服务器
- 静态文件服务（index.html 等）
- POST /api/chat  → 调用 OpenClaw Agent → 千问/DeepSeek 大模型
- GET  /api/health → 健康检查
"""

import http.server
import json
import os
import socketserver
import subprocess
import sys
import uuid
import urllib.parse
from pathlib import Path

PORT = 8080
DIR = Path(__file__).resolve().parent
OPENCLAW_AGENT = "main"
OPENCLAW_TIMEOUT = 120  # seconds
OPENCLAW_BIN = r"C:\Users\Administrator\AppData\Roaming\npm\openclaw.cmd"


def call_openclaw_agent(message: str, session_id: str = None) -> dict:
    """
    Call OpenClaw agent CLI and return parsed result.
    Uses a stable session key so the conversation context is preserved.
    """
    if not session_id:
        session_id = str(uuid.uuid4())[:12]

    session_key = f"agent:{OPENCLAW_AGENT}:zhixin-{session_id}"

    cmd = [
        OPENCLAW_BIN, "agent",
        "--agent", OPENCLAW_AGENT,
        "--session-key", session_key,
        "--message", message,
        "--json",
        "--timeout", str(OPENCLAW_TIMEOUT),
    ]

    print(f"[API] Calling OpenClaw agent (session: {session_id})")
    print(f"[API]   Message: {message[:80]}{'...' if len(message) > 80 else ''}")

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=OPENCLAW_TIMEOUT + 10,
            cwd=str(DIR),
        )

        if result.returncode != 0:
            error_msg = result.stderr.strip() or "Unknown error"
            print(f"[API] ERR OpenClaw error (code {result.returncode}): {error_msg[:200]}")
            return {
                "success": False,
                "error": f"OpenClaw 调用失败: {error_msg}",
                "sessionId": session_id,
            }

        stdout = result.stdout
        if not stdout:
            return {
                "success": False,
                "error": "OpenClaw 返回空响应",
                "sessionId": session_id,
            }

        data = json.loads(stdout)

        if data.get("status") != "ok":
            return {
                "success": False,
                "error": f"Agent 返回异常状态: {data.get('status')}",
                "sessionId": session_id,
            }

        # Extract the response text
        payloads = data.get("result", {}).get("payloads", [])
        reply_text = ""
        for p in payloads:
            if p.get("text"):
                reply_text += p["text"]

        meta = data.get("result", {}).get("meta", {})
        agent_meta = meta.get("agentMeta", {})
        usage = agent_meta.get("usage", {})

        full_reply = data.get("result", {}).get("finalAssistantVisibleText", reply_text)

        print(f"[API] OK Response received ({len(full_reply)} chars, "
              f"{meta.get('durationMs', '?')}ms, "
              f"tokens: {usage.get('total', '?')})")

        return {
            "success": True,
            "reply": full_reply,
            "sessionId": session_id,
            "model": agent_meta.get("model", "unknown"),
            "durationMs": meta.get("durationMs", 0),
            "usage": {
                "input": usage.get("input", 0),
                "output": usage.get("output", 0),
                "total": usage.get("total", 0),
            },
        }

    except subprocess.TimeoutExpired:
        print(f"[API] ERR Timeout after {OPENCLAW_TIMEOUT}s")
        return {
            "success": False,
            "error": f"AI 响应超时（{OPENCLAW_TIMEOUT}秒），请重试",
            "sessionId": session_id,
        }
    except json.JSONDecodeError as e:
        print(f"[API] ERR JSON parse error: {e}")
        print(f"[API]   Raw stdout (first 500 chars): {result.stdout[:500]}")
        return {
            "success": False,
            "error": "AI 响应解析失败，请重试",
            "sessionId": session_id,
        }
    except Exception as e:
        print(f"[API] ERR Unexpected error: {e}")
        return {
            "success": False,
            "error": f"服务异常: {str(e)}",
            "sessionId": session_id,
        }


class ZhixinHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler: serves static files + API endpoints."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIR), **kwargs)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]} {args[1]} {args[2]}")

    def _send_json(self, data: dict, status: int = 200):
        body = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def _send_error_json(self, message: str, status: int = 500):
        self._send_json({"success": False, "error": message}, status)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/health":
            self._send_json({
                "status": "ok",
                "service": "知因AI API Server",
                "openclawAgent": OPENCLAW_AGENT,
                "version": "1.0.0",
            })
            return

        # Serve static files
        if parsed.path == "/":
            self.path = "/index.html"

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/chat":
            # Read request body
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                self._send_error_json("请求体为空", 400)
                return

            try:
                body = self.rfile.read(content_length)
                req = json.loads(body)
            except json.JSONDecodeError:
                self._send_error_json("请求格式错误，需要 JSON", 400)
                return

            message = (req.get("message") or "").strip()
            if not message:
                self._send_error_json("消息不能为空", 400)
                return

            session_id = req.get("sessionId", None)

            # Call OpenClaw agent
            result = call_openclaw_agent(message, session_id)

            if result["success"]:
                self._send_json(result)
            else:
                self._send_json(result, 502)

            return

        # Unknown endpoint
        self._send_error_json(f"未知接口: {parsed.path}", 404)


def main():
    os.chdir(str(DIR))

    # Check that openclaw is available
    try:
        subprocess.run([OPENCLAW_BIN, "--version"], capture_output=True, timeout=5)
        print("[OK] OpenClaw CLI detected")
    except Exception:
        print("[WARN] OpenClaw CLI not found, API calls will fail")
        print("       Install: npm i -g openclaw")

    print("=" * 48)
    print("  ZhiYin AI - Server")
    print("  OpenClaw Gateway -> DeepSeek Model")
    print(f"  Dir:  {DIR}")
    print(f"  URL:  http://localhost:{PORT}")
    print("  API:  POST /api/chat  - AI Chat")
    print("        GET  /api/health - Health Check")
    print("  Ctrl+C to stop")
    print("=" * 48)

    server = http.server.HTTPServer
    httpd = socketserver.TCPServer(("0.0.0.0", PORT), ZhixinHandler)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        httpd.shutdown()


if __name__ == "__main__":
    main()

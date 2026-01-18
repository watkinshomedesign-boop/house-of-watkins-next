import net from "node:net";
import { execSync } from "node:child_process";

function getArgPort(): number {
  const raw = process.argv[2];
  const port = raw ? Number(raw) : NaN;
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Usage: ensurePortFree <port>. Got: ${raw ?? "<missing>"}`);
  }
  return port;
}

function tryGetWindowsProcessInfo(port: number): string | null {
  if (process.platform !== "win32") return null;

  try {
    const netstat = execSync("netstat -ano -p tcp", { stdio: ["ignore", "pipe", "ignore"] }).toString("utf8");
    const lines = netstat
      .split(/\r?\n/g)
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => l.toUpperCase().includes("LISTENING"))
      .filter((l) => l.includes(`:${port}`));

    const pid = lines
      .map((l) => l.split(/\s+/g).pop())
      .find((p) => p && /^\d+$/.test(p));

    if (!pid) return null;

    // WMIC is deprecated but still commonly available on Windows. If it fails, we still provide the PID.
    let details = "";
    try {
      details = execSync(`wmic process where processid=${pid} get Name,CommandLine /FORMAT:LIST`, {
        stdio: ["ignore", "pipe", "ignore"],
      }).toString("utf8");
    } catch {
      details = "";
    }

    const prettyDetails = details
      .split(/\r?\n/g)
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => l.startsWith("Name=") || l.startsWith("CommandLine="))
      .join("\n");

    return prettyDetails.length > 0
      ? `PID=${pid}\n${prettyDetails}`
      : `PID=${pid}`;
  } catch {
    return null;
  }
}

async function main() {
  const port = getArgPort();

  const server = net.createServer();

  await new Promise<void>((resolve) => {
    server.once("error", (err: any) => {
      if (err && err.code === "EADDRINUSE") {
        const procInfo = tryGetWindowsProcessInfo(port);
        const extra = procInfo ? `\n\nProcess using port ${port}:\n${procInfo}` : "";
        console.error(
          `Port ${port} is already in use.\n\n` +
            `This project expects Next.js dev to run on http://localhost:${port}.\n` +
            `If another process is bound to ${port}, Next may start on a different port and your browser will hit the wrong server, causing the HMR/refresh loop.\n\n` +
            `Fix: close/kill the process on ${port} and re-run npm run dev.` +
            extra,
        );
        process.exit(1);
      }

      console.error(`Failed to check port ${port}: ${err?.message ?? String(err)}`);
      process.exit(1);
    });

    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve());
    });
  });
}

main().catch((e) => {
  console.error(e?.message ?? String(e));
  process.exit(1);
});

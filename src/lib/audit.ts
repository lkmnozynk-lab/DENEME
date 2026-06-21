import { prisma } from "@/lib/prisma";
import { getClientIp, hashIp } from "@/lib/rate-limit";

/**
 * Records an admin action to the audit log. Best-effort: never throws into
 * the calling action.
 */
export async function logAudit(params: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}) {
  try {
    const ip = await getClientIp();
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        ipHash: hashIp(ip),
        meta: params.meta ? JSON.stringify(params.meta) : undefined,
      },
    });
  } catch (err) {
    console.error("[audit] failed:", err);
  }
}

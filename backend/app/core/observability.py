import time
import uuid
import logging
from typing import Dict, Any, Optional
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(name)s | %(message)s'
)
logger = logging.getLogger("cipherx.observability")


class ObservabilityMiddleware(BaseHTTPMiddleware):
    """Tracks Request IDs, latency metrics, and structured log events."""

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        start_time = time.time()

        response: Response = await call_next(request)

        duration_ms = round((time.time() - start_time) * 1000, 2)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time-Ms"] = str(duration_ms)

        logger.info(
            f"REQUEST_LOG | id={request_id} | method={request.method} | path={request.url.path} "
            f"| status={response.status_code} | duration_ms={duration_ms}"
        )
        return response


class ExecutionMetricsTracker:
    """Tracks latency for discrete internal pipelines (AI, compliance, rules, reports)."""

    def __init__(self, job_id: Optional[str] = None):
        self.job_id = job_id or f"job-{uuid.uuid4().hex[:8]}"
        self.metrics: Dict[str, float] = {}
        self._starts: Dict[str, float] = {}

    def start(self, metric_name: str):
        self._starts[metric_name] = time.time()

    def stop(self, metric_name: str) -> float:
        if metric_name in self._starts:
            duration = round((time.time() - self._starts[metric_name]) * 1000, 2)
            self.metrics[metric_name] = duration
            return duration
        return 0.0

    def get_summary(self) -> Dict[str, Any]:
        return {
            "job_id": self.job_id,
            "metrics_ms": self.metrics,
            "total_ms": sum(self.metrics.values())
        }

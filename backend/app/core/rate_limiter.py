import time
from collections import defaultdict
from fastapi import Request, HTTPException, status


class SlidingWindowRateLimiter:
    """In-memory sliding window rate limiter per client IP / API Key."""

    def __init__(self, max_requests: int = 120, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    def is_rate_limited(self, client_id: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds

        # Clean old timestamps
        self.requests[client_id] = [t for t in self.requests[client_id] if t > window_start]

        if len(self.requests[client_id]) >= self.max_requests:
            return True

        self.requests[client_id].append(now)
        return False


rate_limiter = SlidingWindowRateLimiter(max_requests=180, window_seconds=60)


async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    if rate_limiter.is_rate_limited(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Maximum 180 requests per minute allowed."
        )
    return await call_next(request)

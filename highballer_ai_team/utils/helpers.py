"""Utility functions for Highballer AI Team."""

import asyncio
import logging
import time
from typing import Any, Callable, Dict, List, Optional
from functools import wraps
from datetime import datetime, timedelta


def setup_logging(name: str, level: str = "INFO") -> logging.Logger:
    """Setup logging for Highballer components."""
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(getattr(logging, level.upper()))
    
    return logger


def retry_async(max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """Decorator for retrying async functions with exponential backoff."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            current_delay = delay
            
            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt == max_retries:
                        break
                    
                    await asyncio.sleep(current_delay)
                    current_delay *= backoff
            
            raise last_exception
        
        return wrapper
    return decorator


def rate_limit(calls_per_second: float = 1.0):
    """Decorator for rate limiting function calls."""
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]
    
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            now = time.time()
            time_since_last = now - last_called[0]
            
            if time_since_last < min_interval:
                await asyncio.sleep(min_interval - time_since_last)
            
            last_called[0] = time.time()
            return await func(*args, **kwargs)
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            now = time.time()
            time_since_last = now - last_called[0]
            
            if time_since_last < min_interval:
                time.sleep(min_interval - time_since_last)
            
            last_called[0] = time.time()
            return func(*args, **kwargs)
        
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    
    return decorator


class MetricsCollector:
    """Simple metrics collection utility."""
    
    def __init__(self):
        self.metrics = {}
        self.start_time = time.time()
    
    def increment(self, metric_name: str, value: int = 1, tags: Optional[Dict[str, str]] = None):
        """Increment a counter metric."""
        key = self._build_key(metric_name, tags)
        if key not in self.metrics:
            self.metrics[key] = {"type": "counter", "value": 0, "tags": tags or {}}
        self.metrics[key]["value"] += value
    
    def gauge(self, metric_name: str, value: float, tags: Optional[Dict[str, str]] = None):
        """Set a gauge metric."""
        key = self._build_key(metric_name, tags)
        self.metrics[key] = {"type": "gauge", "value": value, "tags": tags or {}}
    
    def histogram(self, metric_name: str, value: float, tags: Optional[Dict[str, str]] = None):
        """Record a histogram value."""
        key = self._build_key(metric_name, tags)
        if key not in self.metrics:
            self.metrics[key] = {"type": "histogram", "values": [], "tags": tags or {}}
        self.metrics[key]["values"].append(value)
    
    def timer(self, metric_name: str, tags: Optional[Dict[str, str]] = None):
        """Context manager for timing operations."""
        return TimerContext(self, metric_name, tags)
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get all collected metrics."""
        result = {}
        for key, metric in self.metrics.items():
            if metric["type"] == "histogram":
                values = metric["values"]
                if values:
                    result[key] = {
                        "type": "histogram",
                        "count": len(values),
                        "min": min(values),
                        "max": max(values),
                        "avg": sum(values) / len(values),
                        "tags": metric["tags"]
                    }
            else:
                result[key] = metric
        
        return result
    
    def _build_key(self, metric_name: str, tags: Optional[Dict[str, str]]) -> str:
        """Build metric key with tags."""
        if not tags:
            return metric_name
        
        tag_string = ",".join(f"{k}={v}" for k, v in sorted(tags.items()))
        return f"{metric_name}[{tag_string}]"
    
    def reset(self):
        """Reset all metrics."""
        self.metrics.clear()
        self.start_time = time.time()


class TimerContext:
    """Context manager for timing operations."""
    
    def __init__(self, collector: MetricsCollector, metric_name: str, tags: Optional[Dict[str, str]]):
        self.collector = collector
        self.metric_name = metric_name
        self.tags = tags
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.start_time:
            duration = time.time() - self.start_time
            self.collector.histogram(self.metric_name, duration, self.tags)


def format_bytes(bytes_value: int) -> str:
    """Format bytes into human-readable format."""
    units = ['B', 'KB', 'MB', 'GB', 'TB']
    size = float(bytes_value)
    unit_index = 0
    
    while size >= 1024.0 and unit_index < len(units) - 1:
        size /= 1024.0
        unit_index += 1
    
    return f"{size:.1f} {units[unit_index]}"


def format_duration(seconds: float) -> str:
    """Format duration in seconds to human-readable format."""
    if seconds < 1:
        return f"{seconds * 1000:.0f}ms"
    elif seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        minutes = seconds // 60
        remaining_seconds = seconds % 60
        return f"{minutes:.0f}m {remaining_seconds:.0f}s"
    else:
        hours = seconds // 3600
        remaining_minutes = (seconds % 3600) // 60
        return f"{hours:.0f}h {remaining_minutes:.0f}m"


def parse_time_range(time_string: str) -> timedelta:
    """Parse time range string like '1h', '30m', '24h' into timedelta."""
    time_string = time_string.lower().strip()
    
    if time_string.endswith('s'):
        return timedelta(seconds=int(time_string[:-1]))
    elif time_string.endswith('m'):
        return timedelta(minutes=int(time_string[:-1]))
    elif time_string.endswith('h'):
        return timedelta(hours=int(time_string[:-1]))
    elif time_string.endswith('d'):
        return timedelta(days=int(time_string[:-1]))
    else:
        # Assume seconds if no unit
        return timedelta(seconds=int(time_string))


def batch_process(items: List[Any], batch_size: int = 10):
    """Generator that yields batches of items."""
    for i in range(0, len(items), batch_size):
        yield items[i:i + batch_size]


async def gather_with_limit(coroutines: List, limit: int = 10):
    """Execute coroutines with concurrency limit."""
    semaphore = asyncio.Semaphore(limit)
    
    async def limited_coroutine(coro):
        async with semaphore:
            return await coro
    
    return await asyncio.gather(*[limited_coroutine(coro) for coro in coroutines])


class CircuitBreaker:
    """Simple circuit breaker implementation."""
    
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'closed'  # closed, open, half-open
    
    def call(self, func: Callable, *args, **kwargs):
        """Call function through circuit breaker."""
        if self.state == 'open':
            if self._should_attempt_reset():
                self.state = 'half-open'
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _should_attempt_reset(self) -> bool:
        """Check if circuit breaker should attempt to reset."""
        if not self.last_failure_time:
            return True
        
        return (time.time() - self.last_failure_time) >= self.recovery_timeout
    
    def _on_success(self):
        """Handle successful call."""
        self.failure_count = 0
        self.state = 'closed'
    
    def _on_failure(self):
        """Handle failed call."""
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = 'open'


def validate_config(config: Dict[str, Any], schema: Dict[str, Any]) -> List[str]:
    """Simple configuration validation."""
    errors = []
    
    def validate_dict(data: Dict[str, Any], schema_dict: Dict[str, Any], path: str = ""):
        for key, expected_type in schema_dict.items():
            current_path = f"{path}.{key}" if path else key
            
            if key not in data:
                errors.append(f"Missing required key: {current_path}")
                continue
            
            value = data[key]
            
            if isinstance(expected_type, dict):
                if not isinstance(value, dict):
                    errors.append(f"Expected dict for {current_path}, got {type(value).__name__}")
                else:
                    validate_dict(value, expected_type, current_path)
            elif isinstance(expected_type, type):
                if not isinstance(value, expected_type):
                    errors.append(f"Expected {expected_type.__name__} for {current_path}, got {type(value).__name__}")
    
    validate_dict(config, schema)
    return errors
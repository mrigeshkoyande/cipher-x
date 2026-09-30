import time
import uuid
from typing import Dict, List, Any, Optional

class DataStore:
    """In-memory thread-safe state store for fast development and local demonstration."""
    def __init__(self):
        self.tenants: Dict[str, Dict[str, Any]] = {}
        self.users: Dict[str, Dict[str, Any]] = {}
        self.devices: Dict[str, Dict[str, Any]] = {}
        self.configurations: Dict[str, Dict[str, Any]] = {}
        self.evaluations: Dict[str, Dict[str, Any]] = {}
        self.saved_searches: Dict[str, Dict[str, Any]] = {}
        self.scheduled_scans: Dict[str, Dict[str, Any]] = {}

db_store = DataStore()

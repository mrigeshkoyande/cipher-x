import asyncio
import uuid
from celery import shared_task
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import async_session
from app.models.core import Configuration, ConfigStatus, Device, NormalizedFact, ConfidenceLevel
from app.services.ai.provider import MockAIProvider

async def _process_configuration(config_id: str):
    async with async_session() as db:
        config_uuid = uuid.UUID(config_id)
        config = await db.scalar(select(Configuration).where(Configuration.id == config_uuid))
        if not config:
            return

        device = await db.scalar(select(Device).where(Device.id == config.device_id))

        try:
            # 1. Update status to PROCESSING
            config.status = ConfigStatus.PROCESSING
            await db.commit()

            # 2. Read file (simulate)
            with open(config.storage_path, "r") as f:
                raw_text = f.read()

            # 3. Vendor Detection (Simulated)
            if not device.vendor:
                device.vendor = "Cisco" # Simulated detection
                device.platform = "IOS"
                await db.commit()

            # 4. Normalization / AI extraction
            ai_provider = MockAIProvider()
            extraction_result = await ai_provider.extract_security_facts(raw_text, device.vendor)

            # 5. Store normalized facts
            for fact_dto in extraction_result.facts:
                fact = NormalizedFact(
                    tenant_id=config.tenant_id,
                    configuration_id=config.id,
                    parameter=fact_dto.parameter,
                    value=str(fact_dto.value),
                    confidence_score=fact_dto.confidence,
                    confidence_level=ConfidenceLevel.HIGH if fact_dto.confidence > 0.8 else ConfidenceLevel.REVIEW_REQUIRED,
                    source_lines=f"{fact_dto.evidence.get('line_start')}-{fact_dto.evidence.get('line_end')}",
                    source_text=fact_dto.evidence.get('source_text')
                )
                db.add(fact)
            
            config.status = ConfigStatus.NORMALIZED
            await db.commit()

            # 6. Compliance Engine (Simulated)
            config.status = ConfigStatus.COMPLIANCE_RUNNING
            await db.commit()

            # ... compliance logic ...

            config.status = ConfigStatus.COMPLETED
            await db.commit()

        except Exception as e:
            config.status = ConfigStatus.FAILED
            await db.commit()
            raise e

@shared_task(bind=True, max_retries=3)
def process_configuration_task(self, config_id: str):
    loop = asyncio.get_event_loop()
    loop.run_until_complete(_process_configuration(config_id))
    return f"Processed {config_id}"

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

router = APIRouter()

# In-memory storage for consents
_consents: List[Dict[str, Any]] = []


class ConsentSubmitResponse(BaseModel):
	id: str
	created_at: str


class ConsentRecord(BaseModel):
	id: str
	created_at: str
	data: Dict[str, Any]


@router.post("/consents", response_model=ConsentSubmitResponse)
async def submit_consent(consent: Dict[str, Any]):
	try:
		record_id = str(uuid.uuid4())
		created_at = datetime.utcnow().isoformat() + "Z"
		record: Dict[str, Any] = {
			"id": record_id,
			"created_at": created_at,
			"data": dict(consent),
		}
		_consents.append(record)
		return ConsentSubmitResponse(id=record_id, created_at=created_at)
	except Exception:
		raise HTTPException(status_code=400, detail="Invalid consent payload")


@router.get("/consents", response_model=List[ConsentRecord])
async def list_consents():
	return [ConsentRecord(**r) for r in _consents]


@router.get("/consents/{consent_id}", response_model=ConsentRecord)
async def get_consent(consent_id: str):
	for r in _consents:
		if r.get("id") == consent_id:
			return ConsentRecord(**r)
	raise HTTPException(status_code=404, detail="Consent not found")


class ConsentStatusUpdate(BaseModel):
	status: str


@router.patch("/consents/{consent_id}")
async def update_consent_status(consent_id: str, update: ConsentStatusUpdate):
	for r in _consents:
		if r.get("id") == consent_id:
			# Update the status in the consent data
			r["data"]["status"] = update.status
			return {"message": "Status updated successfully", "id": consent_id, "status": update.status}
	raise HTTPException(status_code=404, detail="Consent not found")


@router.delete("/consents/{consent_id}")
async def delete_consent(consent_id: str):
	global _consents
	for i, r in enumerate(_consents):
		if r.get("id") == consent_id:
			deleted_consent = _consents.pop(i)
			return {"message": "Consent deleted successfully", "id": consent_id}
	raise HTTPException(status_code=404, detail="Consent not found")

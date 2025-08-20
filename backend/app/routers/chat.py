from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import google.generativeai as genai
import re

from ..settings import settings


class FieldMeta(BaseModel):
    key: str
    label: Optional[str] = None
    help: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    context: str  # "trial" | "form"
    infoText: Optional[str] = None
    fields: Optional[List[FieldMeta]] = None


class ChatResponse(BaseModel):
    reply: str
    fieldsPatch: Optional[Dict[str, Any]] = None


router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    def is_explain_query(text: str) -> bool:
        q = text.lower()
        keywords = ["explain", "summary", "summarize", "about", "details", "what is", "information", "tell me about"]
        return any(k in q for k in keywords)

    def is_form_fill_query(text: str) -> bool:
        q = text.lower()
        keywords = ["fill", "enter", "set", "as ", "put", "update"]
        return any(k in q for k in keywords)

    def parse_form_fill_request(message: str) -> Dict[str, Any]:
        lower_input = message.lower()
        patch: Dict[str, Any] = {}

        # email
        m = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", message)
        if m and ("email" in lower_input or "mail" in lower_input):
            patch["email"] = m.group(0)

        # first name
        m = re.search(r"(?:first name|firstname)(?:\s+(?:with|to|as))?\s+(.+?)(?:\s|$)", message, re.I)
        if m and m.group(1):
            patch["firstName"] = m.group(1).strip()

        # last name
        m = re.search(r"(?:last name|lastname)(?:\s+(?:with|to|as))?\s+(.+?)(?:\s|$)", message, re.I)
        if m and m.group(1):
            patch["lastName"] = m.group(1).strip()

        # date of birth
        m = re.search(r"(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4})", message)
        if m and ("date of birth" in lower_input or "dob" in lower_input or "birthday" in lower_input):
            date = m.group(0)
            if "/" in date:
                parts = date.split("/")
                date = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
            patch["dateOfBirth"] = date

        # age (numeric)
        m = re.search(r"age(?:\s+(?:with|to|as))?\s+(\d+)", message, re.I)
        if m and m.group(1):
            patch["age"] = m.group(1)

        # phone numbers
        m = re.search(r"(\+?\d[\d\s\-\(\)]{8,}\d)", message)
        if m and ("phone" in lower_input or "number" in lower_input):
            if "emergency" in lower_input:
                patch["emergencyContactPhone"] = m.group(1)
            else:
                patch["phoneNumber"] = m.group(1)

        # address
        m = re.search(r"address(?:\s+(?:with|to|as))?\s+(.+?)(?:\s|$)", message, re.I)
        if m and m.group(1):
            patch["address"] = m.group(1).strip()

        # emergency contact name
        m = re.search(r"emergency(?:\s+contact)?\s+name(?:\s+(?:with|to|as))?\s+(.+?)(?:\s|$)", message, re.I)
        if m and m.group(1):
            patch["emergencyContactName"] = m.group(1).strip()

        # UCLA patient yes/no
        if "ucla" in lower_input:
            if "yes" in lower_input:
                patch["isUCLAPatient"] = "yes"
            elif "no" in lower_input:
                patch["isUCLAPatient"] = "no"

        # hospital selection
        if "hospital" in lower_input:
            if "university college" in lower_input or "uclh" in lower_input:
                patch["hospital"] = "uclh"
            elif "guys" in lower_input:
                patch["hospital"] = "guys"
            elif "imperial" in lower_input:
                patch["hospital"] = "imperial"
            elif "kings" in lower_input:
                patch["hospital"] = "kings"
            elif "barts" in lower_input:
                patch["hospital"] = "barts"

        # signature
        m = re.search(r"(?:signature|sign)(?:\s+(?:with|to|as))?\s+(.+?)(?:\s|$)", message, re.I)
        if m and m.group(1):
            patch["signature"] = m.group(1).strip()

        return patch

    def get_gemini_response(prompt: str) -> Optional[str]:
        """Helper function to get response from Gemini with error handling"""
        if not settings.gemini_api_key:
            print("DEBUG: No Gemini API key configured")
            return None
            
        try:
            print(f"DEBUG: Attempting Gemini API call with prompt: {prompt[:100]}...")
            genai.configure(api_key=settings.gemini_api_key)
            model = genai.GenerativeModel("gemini-2.0-flash")
            generation_config = {
                "temperature": 0.2,
                "top_p": 0.9,
                "max_output_tokens": 256,
            }
            resp = model.generate_content(prompt, generation_config=generation_config)
            text = resp.text.strip() if hasattr(resp, "text") and resp.text else ""
            print(f"DEBUG: Gemini response: {text[:100]}...")
            return text if text else None
        except Exception as e:
            print(f"DEBUG: Gemini API error: {e}")
            return None

    # Step 1: Handle form filling requests (highest priority)
    if req.context == "form" and is_form_fill_query(req.message):
        patch = parse_form_fill_request(req.message)
        if patch:
            keys = ", ".join(sorted(patch.keys()))
            # Use Gemini for the confirmation message
            prompt = (
                "You are a clinical trial e-consent assistant. "
                f"The user just filled these form fields: {keys}. "
                "Provide a helpful confirmation message that acknowledges the fields were updated and encourages them to continue or ask questions. "
                "Keep it to one sentence."
            )
            gemini_response = get_gemini_response(prompt)
            reply = gemini_response or f"I've updated the following fields: {keys}. You can continue filling the form or ask me questions about any field."
            return ChatResponse(reply=reply, fieldsPatch=patch)

    # Step 2: Handle field-specific explanations
    if req.context == "form" and req.fields and is_explain_query(req.message):
        # Try to match specific field names
        q = req.message.lower()
        for field in req.fields:
            field_names = [field.key.lower()]
            if field.label:
                field_names.extend(field.label.lower().split())
            
            if any(name in q for name in field_names):
                # Always use Gemini for field explanations
                prompt = (
                    "You are a clinical trial e-consent assistant. "
                    f"Explain the '{field.label or field.key}' field clearly and simply. "
                    f"Field details: {field.help or 'N/A'}. "
                    f"User question: {req.message}. "
                    "Be helpful and patient-friendly. Keep it concise: 1–3 sentences unless the user asks for more detail."
                )
                gemini_response = get_gemini_response(prompt)
                if gemini_response:
                    return ChatResponse(reply=gemini_response)
                else:
                    # Only fallback if Gemini completely fails
                    field_info = field.help or f"Information about {field.label or field.key}"
                    return ChatResponse(reply=field_info)

    # Step 3: Handle general explain requests for page content
    if is_explain_query(req.message) and req.infoText:
        # Always use Gemini for content explanations
        prompt = (
            "You are a clinical trial e-consent assistant. "
            f"Explain the following content clearly and simply: {req.infoText}. "
            f"User question: {req.message}. "
            "Be helpful and patient-friendly. Keep it concise: 1–3 sentences unless the user explicitly asks for a detailed explanation."
        )
        gemini_response = get_gemini_response(prompt)
        if gemini_response:
            return ChatResponse(reply=gemini_response)
        else:
            # Only fallback if Gemini completely fails
            return ChatResponse(reply=req.infoText)

    # Step 4: General Q&A using Gemini (for ALL other questions)
    # Build context-aware prompt
    context_info = ""
    if req.context == "trial":
        context_info = "You are helping with a clinical trial. "
    elif req.context == "form":
        context_info = "You are helping with a consent form. "
    
    if req.infoText:
        context_info += f"Relevant information: {req.infoText[:500]} "
    
    if req.fields:
        field_names = [f.label or f.key for f in req.fields[:10]]  # Limit to first 10 fields
        context_info += f"Form fields include: {', '.join(field_names)}. "
    
    prompt = (
        f"{context_info}You are a helpful clinical trial assistant. "
        f"User question: {req.message} "
        "Provide a precise answer in 1–3 sentences unless the user explicitly asks for a longer, detailed explanation."
    )
    
    gemini_response = get_gemini_response(prompt)
    if gemini_response:
        return ChatResponse(reply=gemini_response)
    else:
        # Only fallback if Gemini completely fails
        if req.infoText:
            return ChatResponse(reply=f"I can help you with this {req.context}. {req.infoText[:200]}...")
        return ChatResponse(reply="I'm having trouble right now. Please try asking your question again.")


# Frontend expects this path: /api/chat/text
@router.post("/chat/text", response_model=ChatResponse)
def chat_text(req: ChatRequest):
    return chat(req)



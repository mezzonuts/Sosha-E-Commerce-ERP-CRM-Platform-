import bleach
from typing import Any

ALLOWED_TAGS = [
    "p", "br", "strong", "em", "u", "a", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre"
]

ALLOWED_ATTRIBUTES = {
    "a": ["href", "title"],
    "p": ["class"],
    "h1": ["class"],
    "h2": ["class"],
    "h3": ["class"],
    "blockquote": ["class"],
}

def sanitize_html(html: str) -> str:
    if not html:
        return ""
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True,
    )

def sanitize_string(value: str, max_length: int = 255) -> str:
    if not value:
        return ""
    sanitized = sanitize_html(value)
    return sanitized[:max_length].strip()

def sanitize_dict(data: dict[str, Any], fields: list[str], max_length: int = 255) -> dict[str, Any]:
    sanitized = data.copy()
    for field in fields:
        if field in sanitized and isinstance(sanitized[field], str):
            sanitized[field] = sanitize_string(sanitized[field], max_length)
    return sanitized

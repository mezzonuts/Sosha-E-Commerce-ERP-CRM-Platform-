import pytest
from app.core.sanitization import sanitize_html, sanitize_string, sanitize_dict

def test_sanitize_html_removes_script():
    malicious = '<script>alert("xss")</script><p>Safe content</p>'
    result = sanitize_html(malicious)
    assert "<script>" not in result
    assert "Safe content" in result

def test_sanitize_html_allows_safe_tags():
    safe_html = '<p>Hello <strong>World</strong></p>'
    result = sanitize_html(safe_html)
    assert "<p>" in result
    assert "<strong>" in result
    assert "Hello" in result
    assert "World" in result

def test_sanitize_html_removes_dangerous_attributes():
    html = '<a href="javascript:alert(1)">Click me</a>'
    result = sanitize_html(html)
    assert "javascript:" not in result
    assert "Click me" in result

def test_sanitize_string_empty():
    assert sanitize_string("") == ""

def test_sanitize_string_none():
    assert sanitize_string(None) == ""

def test_sanitize_string_truncates():
    long_string = "a" * 300
    result = sanitize_string(long_string, max_length=100)
    assert len(result) == 100

def test_sanitize_string_strips_whitespace():
    assert sanitize_string("  hello world  ") == "hello world"

def test_sanitize_dict_sanitizes_fields():
    data = {
        "name": "<script>alert('xss')</script>John",
        "description": "Safe description",
        "price": 1000,
    }
    result = sanitize_dict(data, ["name", "description"], max_length=255)
    assert "<script>" not in result["name"]
    assert "John" in result["name"]
    assert result["description"] == "Safe description"
    assert result["price"] == 1000

def test_sanitize_dict_missing_fields():
    data = {"price": 1000}
    result = sanitize_dict(data, ["name", "description"])
    assert result == {"price": 1000}
